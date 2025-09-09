import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import DashboardWidgets from '../components/dashboard/DashboardWidgets';
import Loading from '../components/common/Loading';

const DashboardPage = () => {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return (
     <Loading></Loading>
    );
  }
  
  return (
    <main className="dashboard-main flex-1 md:p-6 p-4 overflow-y-auto"> 
      <DashboardWidgets />
    </main>
  );
};

export default DashboardPage;