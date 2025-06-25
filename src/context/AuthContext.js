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

  const [userEmail, setUserEmail] = useState(() => {
    const stored = localStorage.getItem('token');
    if (!stored) return null;
    try {
      const decoded = JSON.parse(atob(stored.split('.')[1]));
      return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || null;
    } catch {
      return null;
    }
  });

  const [userName, setUserName] = useState(() => {
    const email = localStorage.getItem('token') && userEmail;
    if (!email) return null;
    const namePart = email.split('@')[0];
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  });

  const isLoggedIn = !!token;

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);

    try {
      const decoded = JSON.parse(atob(newToken.split('.')[1]));
      const role = parseInt(decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
      const email = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      const name = email?.split('@')[0] || '';

      setRole(role);
      setUserEmail(email);
      setUserName(name.charAt(0).toUpperCase() + name.slice(1));
    } catch (e) {
      console.error("Eroare la decodarea tokenului", e);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setRole(null);
    setUserEmail(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{
      token, role, isLoggedIn, login, logout,
      userEmail, userName
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
