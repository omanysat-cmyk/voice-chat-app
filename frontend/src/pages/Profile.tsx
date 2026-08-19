import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/store';

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');

  const handleSave = async () => {
    try {
      // Update user API call
      setUser({ ...user, username });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mx-auto flex items-center justify-center text-white text-3xl">
          {user?.username?.[0]?.toUpperCase()}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
          />
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
