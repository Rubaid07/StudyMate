// src/layouts/DashboardLayout.jsx

import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/common/Navbar'; 
import Sidebar from '../components/common/Sidebar'; 

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100"> 
        <Sidebar /> 
      <div className="flex flex-col flex-1">
        <Navbar /> 
        <Outlet /> 
      </div>
    </div>
  );
};

export default DashboardLayout;
