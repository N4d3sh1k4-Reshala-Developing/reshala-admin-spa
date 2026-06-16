import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import client, { resolveUrl } from '../api/client';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const loginUrl = window.ENV_CONFIG?.LOGIN_URL || import.meta.env.VITE_LOGIN_URL || '/api/v0/auth/login';
      const resolvedUrl = resolveUrl(loginUrl);
      console.log('Login URL:', resolvedUrl);
      
      // Use axios directly for absolute URLs, client for relative
      const response = await (loginUrl.startsWith('http') 
        ? axios.post(resolvedUrl, { email, password, rememberMe: String(rememberMe) }, { withCredentials: true })
        : client.post(loginUrl, { email, password, rememberMe: String(rememberMe) })
      );

      const { accessToken } = response.data.data;
      const user = response.data.data.user;

      setAuth(accessToken, user || { username: email.split('@')[0] });

      setIsLoading(false);
      navigate('/admin/dashboard');

    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to login. Please check your credentials.'
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card glass-card">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '0.02em', color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'baseline', gap: '0.15rem', marginBottom: '0.5rem' }}>
            RESHALA<span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-secondary)' }}>admin</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Вход в панель администратора</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', color: 'var(--error)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="form-input"
                placeholder="admin@email.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <label htmlFor="rememberMe" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Remember me
            </label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={isLoading}>
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Reshala Admin SPA v1.0.0
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
