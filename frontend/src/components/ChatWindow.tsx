import React, { useState, useEffect } from 'react';
import { useChatStore, useCallStore } from '../store/store';
import { messageAPI } from '../api/client';
import { getSocket } from '../socket/socket';
import { FiSend, FiPhone, FiMic } from 'react-icons/fi';

interface ChatWindowProps {
  chat: any;
}

export default function ChatWindow({ chat }: ChatWindowProps) {
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const { messages, addMessage } = useChatStore();
  const { setIncomingCall } = useCallStore();
  const socket = getSocket();

  useEffect(() => {
    loadMessages();
    socket.emit('chat:join', chat._id);

    return () => {
      socket.emit('chat:leave', chat._id);
    };
  }, [chat._id]);

  useEffect(() => {
    socket.on('message:new', (data) => {
      addMessage(data);
    });

    socket.on('call:incoming', (data) => {
      setIncomingCall(data);
    });

    return () => {
      socket.off('message:new');
      socket.off('call:incoming');
    };
  }, []);

  const loadMessages = async () => {
    try {
      const response = await messageAPI.getMessages(chat._id);
      // Update messages in store
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setLoading(true);
    try {
      await messageAPI.sendMessage({
        chat: chat._id,
        content: messageText,
      });
      setMessageText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartCall = () => {
    // Implement call initiation
    console.log('Starting call...');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{chat.name}</h2>
          <p className="text-sm text-gray-500">participants</p>
        </div>
        <button
          onClick={handleStartCall}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
        >
          <FiPhone size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'self' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === 'self'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <p>{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <FiMic size={20} className="text-gray-600" />
          </button>
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
          >
            <FiSend size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
