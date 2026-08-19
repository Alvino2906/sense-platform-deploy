import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserPlus, FaTrash, FaUserEdit } from 'react-icons/fa';
import Sidebar from './Sidebar';

const API_URL = process.env.REACT_APP_API_URL;

function Users({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    role: 'user'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/users`);
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/auth/register`, formData);
      setShowModal(false);
      setFormData({ username: '', password: '', full_name: '', role: 'user' });
      fetchUsers();
      alert('✅ User berhasil ditambahkan!');
    } catch (error) {
      alert('❌ Gagal menambahkan user');
    }
  };

  return (
    <div className="flex min-h-screen bg-dark-bg">
      <Sidebar onLogout={onLogout} />
      
      <div className="ml-64 flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">User Management</h1>
            <p className="text-dark-muted">Kelola pengguna sistem SENSE Platform</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
          >
            <FaUserPlus /> Tambah User
          </button>
        </div>

        <div className="glow-card rounded-xl p-6 neon-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left py-3 px-4 text-dark-muted text-sm">Username</th>
                  <th className="text-left py-3 px-4 text-dark-muted text-sm">Full Name</th>
                  <th className="text-left py-3 px-4 text-dark-muted text-sm">Role</th>
                  <th className="text-left py-3 px-4 text-dark-muted text-sm">Created At</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-dark-border/50 hover:bg-dark-bg/50">
                    <td className="py-3 px-4 text-white">{u.username}</td>
                    <td className="py-3 px-4 text-dark-muted">{u.full_name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        u.role === 'admin' 
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-dark-muted text-sm">
                      {new Date(u.created_at).toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Add User */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-dark-card rounded-2xl p-8 w-full max-w-md neon-border">
              <h2 className="text-xl font-bold text-white mb-4">Tambah User Baru</h2>
              <form onSubmit={handleAddUser}>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                    required
                  />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg transition"
                    >
                      Tambah
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-dark-border hover:bg-dark-border/70 py-3 rounded-lg transition"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;