// src/layouts/DashboardLayout.jsx
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigation } from 'react-router';
import Navbar from '../components/common/Navbar'; 
import Sidebar from '../components/common/Sidebar'; 
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import LogoLoading from '../components/common/LogoLoading';

const DashboardLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };
  const navigation = useNavigation()
    const [authChecking, setAuthChecking] = useState(true);
      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, () => {
            setAuthChecking(false);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (navigation.state === 'idle') {
            window.scrollTo(0, 0);
        }
    }, [navigation.state]);
    if (authChecking || navigation.state === "loading") {
        return <LogoLoading />;
    }
  
  return (
    <div className="flex h-screen"> 
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