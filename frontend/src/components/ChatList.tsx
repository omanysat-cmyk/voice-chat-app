import React from 'react';
import { IChat } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface ChatListProps {
  chats: any[];
  onSelectChat: (chat: any) => void;
  selectedChat: any | null;
}

export default function ChatList({ chats, onSelectChat, selectedChat }: ChatListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {chats.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-gray-500">
          No chats yet
        </div>
      ) : (
        <div>
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => onSelectChat(chat)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                selectedChat?._id === chat._id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{chat.name}</h3>
                  <p className="text-sm text-gray-600 truncate mt-1">{chat.lastMessage?.content}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {chat.lastMessageAt && formatDistanceToNow(new Date(chat.lastMessageAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
