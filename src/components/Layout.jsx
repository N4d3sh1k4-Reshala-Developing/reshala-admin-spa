import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  MessageSquare, 
  FileCode, 
  LogOut,
  ShieldCheck,
  RefreshCw,
  Activity,
  Sun,
  Moon
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';

const Layout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const updateToken = useAuthStore((state) => state.updateToken);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  const [theme, setTheme] = React.useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Background refresh logic
  React.useEffect(() => {
    const refreshSession = async () => {
      try {
        console.log('Refreshing session...');
        const { data } = await axios.post('/api/v0/auth/refresh', {}, { withCredentials: true });
        const newToken = data.accessToken;
        updateToken(newToken);

        // Silent Ping to update Gateway cookies for iframes
        await fetch(`${import.meta.env.VITE_MINIO_URL}?adm_token=${newToken}`, { mode: 'no-cors' });
        console.log('Session refreshed successfully.');
      } catch (err) {
        console.error('Refresh failed', err);
      }
    };

    // Auto-refresh every 10 mins
    const interval = setInterval(refreshSession, 10 * 60 * 1000);
    
    // Listen for manual refresh requests
    window.addEventListener('manual-refresh', refreshSession);

    return () => {
      clearInterval(interval);
      window.removeEventListener('manual-refresh', refreshSession);
    };
  }, [updateToken]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="nav-group" style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 0.75rem' }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.02em', color: 'var(--text-primary)', display: 'flex', alignItems: 'baseline', gap: '0.15rem' }}>
              RESHALA<span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-secondary)' }}>admin</span>
            </h1>
          </div>
        </div>

        <nav className="nav-group">
          <div className="nav-label">Core</div>
          <NavLink to="/admin/dashboard" className="nav-link">
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
        </nav>

        <nav className="nav-group">
          <div className="nav-label">External Tools</div>
          <NavLink to="/admin/view/minio" className="nav-link">
            <Database size={18} />
            MinIO Storage
          </NavLink>
          <NavLink to="/admin/view/rabbit" className="nav-link">
            <MessageSquare size={18} />
            RabbitMQ
          </NavLink>
          <NavLink to="/admin/view/swagger" className="nav-link">
            <FileCode size={18} />
            API Swagger
          </NavLink>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button onClick={handleLogout} className="nav-link" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <div style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>
            Welcome back, <span style={{ color: 'var(--text-primary)' }}>{user?.username || 'Admin'}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button 
              className="btn" 
              style={{ padding: '0.5rem', background: 'var(--glass)', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.375rem' }}
              onClick={toggleTheme}
              title={theme === 'dark' ? "Светлая тема" : "Темная тема"}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              className="btn" 
              style={{ padding: '0.5rem', background: 'var(--glass)', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.375rem' }}
              onClick={() => {
                // Trigger a refresh manually
                const event = new CustomEvent('manual-refresh');
                window.dispatchEvent(event);
              }}
              title="Refresh Session"
            >
              <RefreshCw size={18} />
            </button>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
              AD
            </div>
          </div>
        </header>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
