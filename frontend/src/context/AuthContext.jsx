import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const TOKEN_STORAGE_KEY = 'agritech_token';

/**
 * AuthProvider component managing global authentication state.
 *
 * ARCHITECTURAL SECURITY NOTE:
 * In this demo/prototype, the JWT is stored in browser localStorage and attached to outgoing
 * requests via the 'Authorization: Bearer <token>' HTTP header per Architecture Version 2.3.
 *
 * Known Security Limitation:
 * LocalStorage is accessible to any JavaScript running on the same origin and is therefore
 * susceptible to Cross-Site Scripting (XSS) vulnerabilities. For enterprise production deployments,
 * the recommended approach is using HttpOnly, Secure, SameSite cookies to store session tokens.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user profile from GET /api/auth/me using active token
  const refreshProfile = useCallback(async () => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!storedToken) {
      setUser(null);
      setIsLoading(false);
      return null;
    }

    try {
      const response = await api.get('/auth/me');
      if (response.data && response.data.user) {
        setUser(response.data.user);
        return response.data.user;
      }
    } catch (error) {
      console.warn('Failed to refresh user profile. Session expired or invalid token.');
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
    return null;
  }, []);

  // Check authentication status on application mount / page refresh
  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  // Handle user login
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = response.data;

    if (receivedToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
    }
    return receivedUser;
  };

  // Handle user registration
  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    const { token: receivedToken, user: receivedUser } = response.data;

    if (receivedToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
    }
    return receivedUser;
  };

  // Handle user logout
  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    register,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to consume AuthContext cleanly
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

