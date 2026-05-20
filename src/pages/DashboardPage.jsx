import React from 'react';
import { useAuthStore } from '../store/authStore';

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>System Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome to the Reshala Admin Panel.</p>
      </div>

      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', marginTop: '4rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
          Welcome back, {user?.username || 'Admin'}!
        </h3>
        <p style={{ color: 'var(--text-muted)' }}>
          Use the sidebar to navigate to external services such as MinIO, RabbitMQ, Swagger UI, and Dozzle Monitoring.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
