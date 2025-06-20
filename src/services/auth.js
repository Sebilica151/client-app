const API_BASE = 'http://localhost:7219/api';

export const login = async (username, password) => {
    const res = await fetch(`${API_BASE}/Auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
  
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    return data.token;
  };