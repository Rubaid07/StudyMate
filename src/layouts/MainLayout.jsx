import React from 'react';
import { Outlet } from 'react-router';
import Footer from '../components/common/Footer';
import LandingPageNavbar from '../components/common/LandingNavbar';

const MainLayout = () => {
    return (
        <div>
            <LandingPageNavbar></LandingPageNavbar>
            <div>
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default MainLayout;