import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaWifi, FaMicrochip, FaSearch, FaFilter } from 'react-icons/fa';
import Sidebar from './Sidebar';

const API_URL = process.env.REACT_APP_API_URL;

function Sensors({ user, onLogout }) {
  const [sensors, setSensors] = useState([]);
  const [filteredSensors, setFilteredSensors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSensors();
  }, []);

  const fetchSensors = async () => {
    try {
      const response = await axios.get(`${API_URL}/sensors`);
      setSensors(response.data);
      setFilteredSensors(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sensors:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setFilteredSensors(
      sensors.filter(s => 
        s.serial_number.toLowerCase().includes(query) ||
        s.device_type.toLowerCase().includes(query) ||
        s.sector?.toLowerCase().includes(query)
      )
    );
  };

  const getStatusColor = (status) => {
    return status === 'ONLINE' ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="flex min-h-screen bg-dark-bg">
      <Sidebar onLogout={onLogout} />
      
      <div className="ml-64 flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Sensor Data</h1>
            <p className="text-dark-muted">Monitoring semua sensor ESP32 di seluruh facility</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="glow-card rounded-xl p-4 mb-6 neon-border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
              <input
                type="text"
                placeholder="Cari sensor (SN, type, sector)..."
                value={search}
                onChange={handleSearch}
                className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-3 bg-dark-border hover:bg-dark-border/70 rounded-lg transition text-dark-muted">
                <FaFilter /> Filter
              </button>
            </div>
          </div>
        </div>

        {/* Sensor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSensors.map((sensor) => (
            <div key={sensor.id} className="glow-card rounded-xl p-6 neon-border hover:border-blue-500/30 transition">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <FaMicrochip className="text-blue-400" />
                    <span className="font-mono text-sm text-white">{sensor.serial_number}</span>
                  </div>
                  <p className="text-dark-muted text-sm mt-1">{sensor.device_type}</p>
                  <p className="text-dark-muted text-xs mt-1">{sensor.sector}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-sm font-medium ${getStatusColor(sensor.status)}`}>
                    ● {sensor.status}
                  </span>
                  <span className="text-dark-muted text-xs mt-1">
                    {sensor.uptime || 'No uptime data'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSensors.length === 0 && (
          <div className="text-center text-dark-muted py-12">
            <p>Tidak ada sensor ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sensors;