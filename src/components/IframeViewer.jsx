import React from 'react';
import { useAuthStore } from '../store/authStore';

const IframeViewer = ({ serviceUrl, title }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  
  if (!serviceUrl) {
    return <div style={{ padding: '2rem', color: 'var(--error)' }}>Error: Service URL not configured.</div>;
  }

  // Ensure the URL points to the gateway host (e.g. localhost:8180) instead of the frontend host
  const baseUrl = import.meta.env.API_BASE_URL || '';
  let fullServiceUrl = serviceUrl;
  
  if (serviceUrl.startsWith('/') && !serviceUrl.startsWith('http')) {
    // Remove trailing slash from baseUrl if it exists to avoid double slashes
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    fullServiceUrl = `${cleanBaseUrl}${serviceUrl}`;
  }

  // Dynamically append the token to the URL as per requirements
  const iframeSrc = `${fullServiceUrl}${fullServiceUrl.includes('?') ? '&' : '?'}adm_token=${accessToken}`;

  console.log(`[IframeViewer] Rendering ${title}:`, {
    serviceUrl,
    hasToken: !!accessToken,
    finalSrc: iframeSrc
  });

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <iframe
        src={iframeSrc}
        title={title}
        className="iframe-container"
        style={{ flex: 1, border: 'none' }}
        allowFullScreen
      />
    </div>
  );
};

export default IframeViewer;
