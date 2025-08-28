import React from 'react';
import Navbar from '../components/common/Navbar';
import { Outlet } from 'react-router';
import Footer from '../components/common/Footer';

const MainLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div>
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default MainLayout;