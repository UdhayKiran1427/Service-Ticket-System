import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axiosClient from '../api/axiosClient.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ticketUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ticketToken') || '');

  useEffect(() => {
    if (token) {
      axiosClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete axiosClient.defaults.headers.common.Authorization;
    }
  }, [token]);

  const saveAuth = (userData, newToken) => {
    setUser(userData);
    setToken(newToken);
    localStorage.setItem('ticketUser', JSON.stringify(userData));
    localStorage.setItem('ticketToken', newToken);
  };

  const login = async (credentials) => {
    const response = await axiosClient.post('/auth/login', credentials);
    const data = response.data;
    saveAuth({ id: data.id, username: data.username, email: data.email, role: data.role }, data.token);
    return data;
  };

  const register = async (payload) => {
    const response = await axiosClient.post('/auth/register', payload);
    const data = response.data;
    saveAuth({ id: data.id, username: data.username, email: data.email, role: data.role }, data.token);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('ticketUser');
    localStorage.removeItem('ticketToken');
    delete axiosClient.defaults.headers.common.Authorization;
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthed: Boolean(token),
      login,
      register,
      logout,
    }),
    [user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
