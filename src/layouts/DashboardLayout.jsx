// src/layouts/DashboardLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/common/Navbar'; 
import Sidebar from '../components/common/Sidebar'; 

const DashboardLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };
  
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100"> 
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        toggleMobileSidebar={toggleMobileSidebar} 
      /> 
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar toggleMobileSidebar={toggleMobileSidebar} /> 
        <div className='flex-1 overflow-y-auto'>
          <Outlet /> 
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;