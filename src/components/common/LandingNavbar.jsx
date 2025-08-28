import React from 'react';
import { Link } from 'react-router'; 
import logo from '../../assets/logo.png'
const LandingPageNavbar = () => {
    return (
        <div className='py-2 bg-blue-50/90 border-b border-gray-200 sticky top-0 z-50'>
            <div className='w-7xl mx-auto px-4 flex items-center justify-between'>
                <Link to="/" className='flex items-center gap-2'>
                    <img src={logo} alt="StudyMate Logo" className='h-12' />
                    <h1 className='text-4xl font-medium'>StudyMate</h1>
                </Link>
                <Link
                    to="/login"
                    className="text-sm font-medium py-2 px-4 bg-cyan-700 text-white rounded-md hover:bg-cyan-800 transition-colors duration-200"
                >
                    Sign In
                </Link>
            </div>
        </div>
    );
};

export default LandingPageNavbar;
