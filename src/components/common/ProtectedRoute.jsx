import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import LogoLoading from './LogoLoading';
const ProtectedRoute = ({ children, publicOnly = false }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <LogoLoading></LogoLoading>
  }


  if (publicOnly) {
    return user ? <Navigate to="/dashboard" replace /> : children;
  }
  return user ? children : <Navigate to="/login" replace state={{ from: location }} />;
};

export default ProtectedRoute;
