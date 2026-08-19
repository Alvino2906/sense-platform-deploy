import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaMicrochip, FaUsers, FaChartLine, FaSignOutAlt, 
  FaTachometerAlt, FaDatabase 
} from 'react-icons/fa';

function Sidebar({ onLogout }) {
  const menuItems = [
    { path: '/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
    { path: '/sensors', icon: FaMicrochip, label: 'Sensor Data' },
    { path: '/users', icon: FaUsers, label: 'User Management' },
  ];

  return (
    <div className="w-64 bg-dark-card border-r border-dark-border min-h-screen p-4 fixed left-0 top-0">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center neon-border">
          <FaMicrochip className="text-blue-500 text-xl" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">SENSE</h1>
          <p className="text-xs text-dark-muted">Platform</p>
        </div>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                  : 'text-dark-muted hover:bg-dark-bg hover:text-white'
              }`
            }
          >
            <item.icon className="text-lg" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-dark-muted hover:bg-red-500/10 hover:text-red-400 w-full transition"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;