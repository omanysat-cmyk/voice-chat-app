import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/store';
import { FiLogOut, FiUser } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">🎙️ Voice Chat</h1>

      <div className="flex items-center gap-4">
        <span className="text-gray-700">{user?.username}</span>
        <button
          onClick={() => navigate('/profile')}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <FiUser size={20} />
        </button>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition"
        >
          <FiLogOut size={20} />
        </button>
      </div>
    </nav>
  );
}
