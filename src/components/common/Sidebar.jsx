import React, { useContext } from "react";
import { Link, useNavigate } from "react-router";
import {
  FiX,
  FiHome,
  FiBook,
  FiDollarSign,
  FiCalendar,
  FiHelpCircle,
  FiLogOut,
  FiUser
} from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Sidebar = ({ isMobileOpen, toggleMobileSidebar }) => {
  const { logOut, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Successfully logged out!");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout.");
    }
  };

  const menuItems = [
    { to: "/dashboard", icon: <FiHome className="w-5 h-5" />, label: "Dashboard" },
    { to: "/dashboard/classes", icon: <FiBook className="w-5 h-5" />, label: "Class Schedule" },
    { to: "/dashboard/budget", icon: <FiDollarSign className="w-5 h-5" />, label: "Budget Tracker" },
    { to: "/dashboard/planner", icon: <FiCalendar className="w-5 h-5" />, label: "Study Planner" },
    { to: "/dashboard/exam-qa", icon: <FiHelpCircle className="w-5 h-5" />, label: "Exam Q&A" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-gray-600/70 bg-opacity-50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleMobileSidebar}
        ></div>
      )}

      <div
        className={`w-64 bg-gradient-to-b from-white to-blue-50 shadow-lg p-4 flex flex-col h-screen fixed lg:sticky top-0 transition-transform duration-300 z-50 lg:z-auto ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-indigo-800">StudyMate</h1>
          <button
            className="lg:hidden ml-auto p-1 rounded-md text-gray-500 hover:bg-indigo-50 transition-colors cursor-pointer"
            onClick={toggleMobileSidebar}
          >
            <FiX size={20} />
          </button>
        </Link>

        {/* user card */}
        <div className="bg-indigo-50 rounded-xl p-4 mb-6 flex items-center gap-3">
          <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img
              src={
                user?.photoURL ||
                "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg"
              }
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 truncate">{user?.displayName || "User"}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || "student@example.com"}</p>
          </div>
        </div>

        {/* menu */}
        <ul className="menu w-full text-gray-700 space-y-1 flex-1">
          {menuItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="flex items-center gap-3 rounded-lg py-3 px-4 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all duration-200 group font-medium"
                onClick={() =>
                  window.innerWidth < 1024 && toggleMobileSidebar()
                }
              >
                <span className="text-indigo-500 group-hover:text-indigo-600 transition-colors">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* bottom section */}
        <div className="pt-4 border-t border-gray-100">
          <Link
            to="/profile"
            className="flex items-center gap-3 rounded-lg py-3 px-4 text-gray-700 hover:bg-white hover:text-indigo-600 transition-all duration-200 mb-2 font-medium"
          >
            <FiUser className="w-5 h-5" />
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg py-3 px-4 text-red-500 hover:bg-red-50 transition-all duration-200 w-full font-medium"
          >
            <FiLogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;