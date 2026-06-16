import React from 'react';
import IframeViewer from '../components/IframeViewer';

const DashboardPage = () => {
  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'calc(100vh - 64px)', boxSizing: 'border-box' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Мониторинг логов (Dozzle)
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Просмотр логов контейнеров в реальном времени.
        </p>
      </div>
      
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden', flex: 1, background: 'var(--bg-card)' }}>
        <IframeViewer serviceUrl={import.meta.env.DOZZLE_URL} title="Dozzle Logs" />
      </div>
    </div>
  );
};

export default DashboardPage;

