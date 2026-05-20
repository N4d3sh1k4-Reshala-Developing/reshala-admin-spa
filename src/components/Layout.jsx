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
  Activity
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';

const Layout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const updateToken = useAuthStore((state) => state.updateToken);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.75rem' }}>
            <div style={{ background: 'var(--accent)', padding: '0.5rem', borderRadius: '0.5rem' }}>
              <ShieldCheck size={24} color="white" />
            </div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Reshala Admin</h1>
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
          <NavLink to="/admin/view/dozzle" className="nav-link">
            <Activity size={18} />
            Dozzle Monitoring
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
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              className="btn" 
              style={{ padding: '0.5rem', background: 'var(--glass)', color: 'var(--text-secondary)' }}
              onClick={() => {
                // Trigger a refresh manually
                const event = new CustomEvent('manual-refresh');
                window.dispatchEvent(event);
              }}
              title="Refresh Session"
            >
              <RefreshCw size={18} />
            </button>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
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
