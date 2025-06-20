import { createContext, useContext, useState } from 'react';

// Funcție utilitară pentru extragerea rolului din token
const getUserRoleFromToken = (token) => {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    const rawRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    return parseInt(rawRole);
  } catch (err) {
    console.error("Eroare la decodificarea tokenului:", err);
    return null;
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [role, setRole] = useState(() => {
    const stored = localStorage.getItem('token');
    return stored ? getUserRoleFromToken(stored) : null;
  });

  const isLoggedIn = !!token;

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  
    const decoded = parseJwt(newToken);
    const role = parseInt(decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);

    setRole(role);
  };
  
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error("Eroare la decodarea tokenului", e);
      return null;
    }
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
