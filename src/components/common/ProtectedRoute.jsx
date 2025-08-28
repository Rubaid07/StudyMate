
import React, { useContext } from 'react';
import { Navigate } from 'react-router';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
