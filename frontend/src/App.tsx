import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/store';
import { connectSocket } from './socket/socket';
import Login from './pages/Login';
import Register from './pages/Register';
import Chats from './pages/Chats';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  React.useEffect(() => {
    if (isAuthenticated) {
      connectSocket();
    }
  }, [isAuthenticated]);

  return (
    <div>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/chats" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/chats" /> : <Register />}
        />
        <Route
          path="/chats"
          element={
            <ProtectedRoute>
              <Chats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? '/chats' : '/login'} />} />
      </Routes>
    </div>
  );
}
