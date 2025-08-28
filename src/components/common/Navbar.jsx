import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router'; 
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast'; 
import logo from '../../assets/logo.png';
import { FiChevronDown, FiUser, FiLogOut } from 'react-icons/fi'; 

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Successfully logged out!");
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout.");
    } finally {
        setIsDropdownOpen(false); 
    }
  };

  return (
    <div className='py-2 bg-blue-50/90 border-b border-gray-200 sticky top-0 z-50'>
        <div className='w-7xl mx-auto px-4 flex items-center justify-between'>
            <Link to={user ? "/dashboard" : "/"} className='flex items-center gap-2'>
                <img src={logo} alt="StudyMate Logo" className='h-12 rounded-full' />
                <h1 className='text-4xl font-medium'>StudyMate</h1>
            </Link>
            
            {user ? (
                <div className="relative">
                    <button
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-50 border border-gray-200 transition-colors duration-200"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <div className="h-8 w-8 rounded-full overflow-hidden">
                            <img
                                src={user?.photoURL || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
                                alt="User"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-sm font-medium text-gray-700 hidden sm:inline-block">
                            {user?.displayName || 'Account'}
                        </span>
                        <FiChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-220 ${
                            isDropdownOpen ? 'rotate-180' : ''
                        }`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg z-50">
                            <Link
                                to="/profile" 
                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 transition-colors duration-200"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <FiUser className="mr-2 h-4 w-4 text-gray-500" />
                                Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors duration-200"
                            >
                                <FiLogOut className="mr-2 h-4 w-4 text-red-500" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <Link
                    to="/login"
                    className="text-sm font-medium py-2 px-4 bg-cyan-700 text-white rounded-md hover:bg-cyan-800 transition-colors duration-200"
                >
                    Sign In
                </Link>
            )}
        </div>
    </div>
  );
};

export default Navbar;
