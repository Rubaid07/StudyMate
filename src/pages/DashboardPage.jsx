import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DashboardWidgets from '../components/dashboard/DashboardWidgets';

const DashboardPage = () => {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  return (
    <main className="flex-1 p-6 overflow-y-auto"> 
      <DashboardWidgets />
    </main>
  );
};

export default DashboardPage;