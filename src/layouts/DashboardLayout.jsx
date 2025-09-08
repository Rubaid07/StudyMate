import React, { useEffect, useState } from 'react';
import { Outlet, useNavigation } from 'react-router';
import Navbar from '../components/common/Navbar'; 
import Sidebar from '../components/common/Sidebar'; 
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import LogoLoading from '../components/common/LogoLoading';
import ScrollToTop from '../components/common/ScrollToTop';

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
    if (authChecking || navigation.state === "loading") {
        return <LogoLoading />;
    }
  
  return (
    <div className="flex h-screen">
      <ScrollToTop></ScrollToTop>
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