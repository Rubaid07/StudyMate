// src/components/common/ProtectedRoute.jsx

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

  // If the route is for public users only (e.g., /, /login, /signup)
  if (publicOnly) {
    // And if the user is logged in, redirect to the dashboard
    return user ? <Navigate to="/dashboard" replace /> : children;
  }

  // If the route is protected (e.g., /dashboard and its sub-routes)
  // And if the user is not logged in, redirect to the login page
  return user ? children : <Navigate to="/login" replace state={{ from: location }} />;
};

export default ProtectedRoute;
