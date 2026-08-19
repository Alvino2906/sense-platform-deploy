import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaLock, FaMicrochip } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL;

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
      });

      localStorage.setItem('token', response.data.token);
      onLogin(response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
      <div className="glow-card rounded-2xl p-8 w-full max-w-md neon-border">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center neon-border">
              <FaMicrochip className="text-blue-500 text-3xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white glow-text">SENSE Platform</h1>
          <p className="text-dark-muted mt-1">Technical Operations</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-muted mb-1">Username</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 focus:outline-none transition"
                  placeholder="Masukkan username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-muted mb-1">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 focus:outline-none transition"
                  placeholder="Masukkan password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Masuk ke Dashboard'}
            </button>

            <p className="text-center text-dark-muted text-sm mt-4">
              Demo: admin / admin123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;