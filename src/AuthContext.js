import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('tiktok_access_token') || null);

  const saveAccessToken = (token) => {
    setAccessToken(token);
    localStorage.setItem('tiktok_access_token', token);
  };

  const clearAccessToken = () => {
    setAccessToken(null);
    localStorage.removeItem('tiktok_access_token');
  };

  return (
    <AuthContext.Provider value={{ accessToken, saveAccessToken, clearAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
