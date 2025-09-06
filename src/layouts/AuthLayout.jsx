import React from 'react';
import { Outlet } from 'react-router';
import LandingPageNavbar from '../components/common/LandingNavbar';

const AuthLayout = () => {
    return (
        <div>
            <LandingPageNavbar></LandingPageNavbar>
            <div className='min-h-[calc(100vh-67px)] bg-indigo-50/40'>
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default AuthLayout;