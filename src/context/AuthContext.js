import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [role, setRole] = useState(() => {
    const stored = localStorage.getItem('token');
    return stored ? jwtDecode(stored).role : null;
  });

  const isLoggedIn = !!token;

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setRole(jwtDecode(newToken).role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
