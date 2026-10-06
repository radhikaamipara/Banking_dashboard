import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#1c2a8f', fontWeight: '700' }}>
        Verifying Secure Banking Session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={adminOnly ? "/login?tab=admin" : "/login?tab=customer"} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/user/dashboard" replace />;
  }

  return <Outlet />;
};
