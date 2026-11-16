import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('webtrek_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('webtrek_admin_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.data.success) {
            setAdmin(res.data.admin);
            localStorage.setItem('webtrek_admin_user', JSON.stringify(res.data.admin));
          }
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setAdmin(res.data.admin);
      localStorage.setItem('webtrek_admin_token', res.data.token);
      localStorage.setItem('webtrek_admin_user', JSON.stringify(res.data.admin));
      return res.data;
    }
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('webtrek_admin_token');
    localStorage.removeItem('webtrek_admin_user');
  };

  return (
    <AuthContext.Provider value={{ admin, token, isAuthenticated: !!token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

