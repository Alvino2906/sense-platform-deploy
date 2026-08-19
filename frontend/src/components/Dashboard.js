import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMicrochip, FaWifi, FaExclamationTriangle, FaServer } from 'react-icons/fa';
import Sidebar from './Sidebar';

const API_URL = process.env.REACT_APP_API_URL;

function Dashboard({ user, onLogout }) {
  const [stats, setStats] = useState({ total: 0, online: 0, offline: 0 });
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, sensorsRes] = await Promise.all([
        axios.get(`${API_URL}/sensors/stats`),
        axios.get(`${API_URL}/sensors`)
      ]);
      setStats(statsRes.data);
      setSensors(sensorsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await axios.put(`${API_URL}/sensors/${id}`, { status: 'OFFLINE' });
      fetchData();
    } catch (error) {
      console.error('Error updating sensor:', error);
    }
  };

  const statCards = [
    { 
      label: 'TOTAL ESP32 NODES', 
      value: stats.total || 0, 
      icon: FaServer,
      color: 'blue'
    },
    { 
      label: 'ACTIVE & ONLINE', 
      value: `${stats.online || 0} (${stats.total ? ((stats.online/stats.total)*100).toFixed(1) : 0}%)`, 
      icon: FaWifi,
      color: 'green'
    },
    { 
      label: 'INACTIVE / FAILS', 
      value: stats.offline || 0, 
      icon: FaExclamationTriangle,
      color: 'red'
    },
  ];

  return (
    <div className="flex min-h-screen bg-dark-bg">
      <Sidebar onLogout={onLogout} />
      
      <div className="ml-64 flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">SENSE Smart Monitoring</h1>
            <p className="text-dark-muted">
              Live telemetry and control interface for deployed ESP32 hardware fleets
            </p>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-lg px-4 py-2">
            <span className="text-sm text-dark-muted">👤 {user?.full_name}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="glow-card rounded-xl p-6 neon-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-muted text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-1 glow-text">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-600/20 rounded-xl flex items-center justify-center neon-border`}>
                  <stat.icon className={`text-${stat.color}-400 text-2xl`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sensor Table */}
        <div className="glow-card rounded-xl p-6 neon-border">
          <h2 className="text-lg font-semibold text-white mb-4">ESP32 Device Inventory</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left py-3 px-4 text-dark-muted text-sm font-medium">Serial Number</th>
                  <th className="text-left py-3 px-4 text-dark-muted text-sm font-medium">Device Type</th>
                  <th className="text-left py-3 px-4 text-dark-muted text-sm font-medium">Sector</th>
                  <th className="text-left py-3 px-4 text-dark-muted text-sm font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-dark-muted text-sm font-medium">Uptime</th>
                  <th className="text-left py-3 px-4 text-dark-muted text-sm font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {sensors.map((sensor) => (
                  <tr key={sensor.id} className="border-b border-dark-border/50 hover:bg-dark-bg/50 transition">
                    <td className="py-3 px-4 text-white font-mono text-sm">{sensor.serial_number}</td>
                    <td className="py-3 px-4 text-dark-muted">{sensor.device_type}</td>
                    <td className="py-3 px-4 text-dark-muted">{sensor.sector}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        sensor.status === 'ONLINE' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {sensor.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-dark-muted">{sensor.uptime || '—'}</td>
                    <td className="py-3 px-4">
                      {sensor.status === 'ONLINE' && (
                        <button
                          onClick={() => handleDeactivate(sensor.id)}
                          className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition border border-red-500/30"
                        >
                          DEACTIVATE
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-dark-muted text-sm">
          <p>© 2024 SENSE IoT Systems. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-2">
            <span className="hover:text-white cursor-pointer">DOCUMENTATION</span>
            <span className="hover:text-white cursor-pointer">PRIVACY POLICY</span>
            <span className="hover:text-white cursor-pointer">SYSTEM STATUS</span>
            <span className="hover:text-white cursor-pointer">CONTACT SUPPORT</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;