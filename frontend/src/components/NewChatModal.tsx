import React, { useState } from 'react';
import { userAPI, chatAPI } from '../api/client';
import { FiX, FiSearch } from 'react-icons/fi';

interface NewChatModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewChatModal({ onClose, onSuccess }: NewChatModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length < 2) {
      setUsers([]);
      return;
    }

    try {
      const response = await userAPI.searchUsers(query);
      setUsers(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const toggleUser = (user: any) => {
    if (selectedUsers.find((u) => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) return;

    setLoading(true);
    try {
      if (selectedUsers.length === 1) {
        // Create private chat
        await chatAPI.getPrivateChat(selectedUsers[0]._id);
      } else {
        // Create group chat
        await chatAPI.createGroupChat({
          name: `Group Chat`,
          participants: selectedUsers.map((u) => u._id),
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to create chat:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">New Chat</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Selected Users */}
        {selectedUsers.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Selected ({selectedUsers.length})</p>
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {user.username}
                  <button
                    onClick={() => toggleUser(user)}
                    className="font-bold cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User List */}
        <div className="max-h-64 overflow-y-auto mb-4">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => toggleUser(user)}
              className={`p-3 rounded-lg cursor-pointer transition ${
                selectedUsers.find((u) => u._id === user._id)
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'hover:bg-gray-100'
              }`}
            >
              <p className="font-medium text-gray-900">{user.username}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateChat}
            disabled={loading || selectedUsers.length === 0}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
          >
            {loading ? 'Creating...' : 'Create Chat'}
          </button>
        </div>
      </div>
    </div>
  );
}
