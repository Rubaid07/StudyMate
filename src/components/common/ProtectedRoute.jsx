import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router'; 
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children, publicOnly = false }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation(); 

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (publicOnly) {
    return user ? <Navigate to="/dashboard" replace /> : children;
  }
  return user ? children : <Navigate to="/login" replace state={{ from: location }} />;
};

export default ProtectedRoute;
