import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await loginApi(formData.username, formData.password);
      login(token);
      navigate('/dashboard');
    } catch (err) {
      setError('Login eșuat. Verifică datele!');
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleSubmit} className="login-box">
        <h2>Autentificare</h2>
        {error && <div className="login-error">{error}</div>}
        <input
          type="text"
          name="username"
          placeholder="Email"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Parolă"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <div className="login-actions">
          <button type="submit">Login</button>
          <button type="button" className="secondary" onClick={() => navigate('/register')}>
            Creează cont
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
