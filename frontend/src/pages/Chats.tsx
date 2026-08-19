import React, { useState, useEffect } from 'react';
import { useChatStore } from '../store/store';
import { chatAPI } from '../api/client';
import { FiPlus, FiSearch } from 'react-icons/fi';
import ChatWindow from '../components/ChatWindow';
import ChatList from '../components/ChatList';
import NewChatModal from '../components/NewChatModal';

export default function Chats() {
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { chats, currentChat, setChats, setCurrentChat } = useChatStore();

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const response = await chatAPI.getChats();
      setChats(response.data);
    } catch (error) {
      console.error('Failed to load chats:', error);
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">🎙️ Chats</h1>
            <button
              onClick={() => setShowNewChat(true)}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
            >
              <FiPlus size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Chat List */}
        <ChatList chats={filteredChats} onSelectChat={setCurrentChat} selectedChat={currentChat} />
      </div>

      {/* Chat Window */}
      <div className="flex-1">
        {currentChat ? (
          <ChatWindow chat={currentChat} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-xl font-semibold mb-2">Select a chat to start</p>
              <p>Choose from your existing chats or create a new one</p>
            </div>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <NewChatModal onClose={() => setShowNewChat(false)} onSuccess={() => {
          setShowNewChat(false);
          loadChats();
        }} />
      )}
    </div>
  );
}
