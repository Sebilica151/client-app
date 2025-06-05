import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../services/auth';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = await loginApi(formData.username, formData.password);
      login(token);             // salvează în context + localStorage
      navigate('/dashboard');    // imediat după login, fără reload
    } catch (err) {
      setError('Login eșuat. Verifică datele!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Autentificare</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        name="username"
        placeholder="Email"
        value={formData.username}
        onChange={e => setFormData({ ...formData, username: e.target.value })}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Parolă"
        value={formData.password}
        onChange={e => setFormData({ ...formData, password: e.target.value })}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginPage;
