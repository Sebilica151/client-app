// src/utils/authUtils.js
export const getUserRoleFromToken = (token) => {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
    } catch (err) {
      console.error("Token decode error", err);
      return null;
    }
  };
  
  export const decodeToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  };


  