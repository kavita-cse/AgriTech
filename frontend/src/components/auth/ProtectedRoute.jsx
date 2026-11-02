import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Route Guard component for protected areas (e.g. /dashboard)
 * Redirects unauthenticated visitors to /login, while preserving target route in state.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-soft-gradient">
        <div className="spinner-border text-success mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading session...</span>
        </div>
        <p className="text-forest fw-semibold small">Verifying AgriTech authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-soft-gradient p-4 text-center">
        <div className="alert alert-danger rounded-4 shadow-sm p-4" style={{ maxWidth: '480px' }}>
          <i className="bi bi-shield-x fs-1 text-danger mb-2 d-block"></i>
          <h4 className="h5 fw-bold text-dark">Access Restricted</h4>
          <p className="text-muted small mb-3">
            Your account role (<strong>{user?.role}</strong>) does not have permission to view this page.
          </p>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

