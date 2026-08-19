import { create } from 'zustand';

interface AuthStore {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: any, token: string) => void;
  logout: () => void;
  setUser: (user: any) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  login: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  setUser: (user) => set({ user }),
}));

interface ChatStore {
  chats: any[];
  currentChat: any | null;
  messages: any[];
  onlineUsers: string[];
  setChats: (chats: any[]) => void;
  setCurrentChat: (chat: any) => void;
  setMessages: (messages: any[]) => void;
  addMessage: (message: any) => void;
  setOnlineUsers: (users: string[]) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chats: [],
  currentChat: null,
  messages: [],
  onlineUsers: [],
  setChats: (chats) => set({ chats }),
  setCurrentChat: (chat) => set({ currentChat: chat }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setOnlineUsers: (users) => set({ onlineUsers: users }),
}));

interface CallStore {
  incomingCall: any | null;
  ongoingCall: any | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  setIncomingCall: (call: any) => void;
  setOngoingCall: (call: any) => void;
  setLocalStream: (stream: MediaStream | null) => void;
  setRemoteStream: (stream: MediaStream | null) => void;
  clearCall: () => void;
}

export const useCallStore = create<CallStore>((set) => ({
  incomingCall: null,
  ongoingCall: null,
  localStream: null,
  remoteStream: null,
  setIncomingCall: (call) => set({ incomingCall: call }),
  setOngoingCall: (call) => set({ ongoingCall: call }),
  setLocalStream: (stream) => set({ localStream: stream }),
  setRemoteStream: (stream) => set({ remoteStream: stream }),
  clearCall: () => set({ incomingCall: null, ongoingCall: null, localStream: null, remoteStream: null }),
}));
