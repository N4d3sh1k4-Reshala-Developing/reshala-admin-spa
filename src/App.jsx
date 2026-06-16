import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import IframeViewer from './components/IframeViewer';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/admin" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="view/minio" element={
            <IframeViewer serviceUrl={import.meta.env.MINIO_URL} title="MinIO Console" />
          } />
          <Route path="view/rabbit" element={
            <IframeViewer serviceUrl={import.meta.env.RABBIT_URL} title="RabbitMQ Management" />
          } />
          <Route path="view/dozzle" element={
            <IframeViewer serviceUrl={import.meta.env.DOZZLE_URL} title="Dozzle Monitoring" />
          } />
          <Route path="view/swagger" element={
            <IframeViewer serviceUrl={import.meta.env.SWAGGER_URL} title="API Documentation" />
          } />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
