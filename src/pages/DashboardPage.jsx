import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DashboardWidgets from '../components/dashboard/DashboardWidgets';

const DashboardPage = () => {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="dashboard-loading flex items-center justify-center min-h-screen dashboard-main">
        <div className="text-center">
          <div className="loading-spinner w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="loading-text mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <main className="dashboard-main flex-1 p-6 overflow-y-auto"> 
      <DashboardWidgets />
    </main>
  );
};

export default DashboardPage;