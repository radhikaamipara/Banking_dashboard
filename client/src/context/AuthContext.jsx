import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

const getInitialToken = () => {
  try {
    return sessionStorage.getItem('yono_token') || localStorage.getItem('yono_token') || null;
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [primaryAccount, setPrimaryAccount] = useState(null);
  const [token, setToken] = useState(getInitialToken);
  const [loading, setLoading] = useState(true);

  // Load user on mount or token change
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await api.getMe();
        setUser(data.user);
        const primary = data.accounts.find((a) => a.isPrimary) || data.accounts[0] || null;
        setPrimaryAccount(primary);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    sessionStorage.setItem('yono_token', data.token);
    localStorage.setItem('yono_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setPrimaryAccount(data.account);
    return data;
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    sessionStorage.setItem('yono_token', data.token);
    localStorage.setItem('yono_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setPrimaryAccount(data.account);
    return data;
  };

  const logout = () => {
    sessionStorage.removeItem('yono_token');
    localStorage.removeItem('yono_token');
    setToken(null);
    setUser(null);
    setPrimaryAccount(null);
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const data = await api.getMe();
      setUser(data.user);
      const primary = data.accounts.find((a) => a.isPrimary) || data.accounts[0] || null;
      setPrimaryAccount(primary);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  // Demo 1-Click Role Switcher
  const switchDemoRole = async (roleType) => {
    let email = '';
    let pass = '';

    if (roleType === 'admin') {
      email = 'admin@sbi.com';
      pass = 'Admin@123';
    } else if (roleType === 'rahul') {
      email = 'rahul.sharma@example.com';
      pass = 'User@123';
    } else if (roleType === 'priya') {
      email = 'priya.patel@example.com';
      pass = 'User@123';
    } else if (roleType === 'amit') {
      email = 'amit.kumar@example.com';
      pass = 'User@123';
    }

    try {
      return await login(email, pass);
    } catch (error) {
      console.error('Demo switcher error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        primaryAccount,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        refreshUser,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
