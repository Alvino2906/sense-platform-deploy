import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Sensors from './components/Sensors';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? 
          <Navigate to="/dashboard" /> : 
          <Login onLogin={handleLogin} />
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          isAuthenticated ? 
          <Dashboard user={user} onLogout={handleLogout} /> : 
          <Navigate to="/login" />
        } 
      />
      <Route 
        path="/users" 
        element={
          isAuthenticated ? 
          <Users user={user} onLogout={handleLogout} /> : 
          <Navigate to="/login" />
        } 
      />
      <Route 
        path="/sensors" 
        element={
          isAuthenticated ? 
          <Sensors user={user} onLogout={handleLogout} /> : 
          <Navigate to="/login" />
        } 
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;