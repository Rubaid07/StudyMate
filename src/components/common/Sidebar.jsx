import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import {
  Home,
  BookOpen,
  DollarSign,
  Calendar,
  HelpCircle,
  LogOut,
  X,
  Smile,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Sidebar = ({ isMobileOpen, toggleMobileSidebar }) => {
  const { logOut, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

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
    { 
      to: "/dashboard", 
      icon: <Home className="w-5 h-5" />, 
      label: "Dashboard" 
    },
    { 
      to: "/dashboard/classes", 
      icon: <BookOpen className="w-5 h-5" />, 
      label: "Class Schedule" 
    },
    { 
      to: "/dashboard/budget", 
      icon: <DollarSign className="w-5 h-5" />, 
      label: "Budget Tracker" 
    },
    { 
      to: "/dashboard/planner", 
      icon: <Calendar className="w-5 h-5" />, 
      label: "Study Planner" 
    },
    { 
      to: "/dashboard/exam-qa", 
      icon: <HelpCircle className="w-5 h-5" />, 
      label: "Exam Q&A" 
    },
    { 
      to: "/dashboard/wellness", 
      icon: <Smile className="w-5 h-5" />, 
      label: "Wellness Tracker" 
    },
  ];

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-gray-600/70 bg-opacity-50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleMobileSidebar}
        ></div>
      )}

      <div
        className={`w-64 landing-navbar bg-white border-r border-gray-100 shadow-sm p-4 flex flex-col h-screen fixed lg:sticky top-0 transition-transform duration-300 z-50 lg:z-auto ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* logo */}
        <Link 
          to="/dashboard" 
          className="flex items-center gap-3 mb-8"
          onClick={() => window.innerWidth < 1024 && toggleMobileSidebar()}
        >
          <div className="h-10 w-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <p className="font-bold text-white text-xl">S</p>
          </div>
          <h1 className="text-2xl font-bold text-indigo-800">StudyMate</h1>
          <button
            className="lg:hidden ml-auto p-1 rounded-md text-gray-500 hover:bg-indigo-50 transition-colors cursor-pointer"
            onClick={toggleMobileSidebar}
          >
            <X size={20} />
          </button>
        </Link>

        {/* user info */}
        <div className="bg-indigo-50 feature-item rounded-xl p-4 mb-6 flex items-center gap-3">
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
            <p className="font-medium text-gray-800 faq-question truncate">{user?.displayName || "User"}</p>
            <p className="text-xs text-gray-500 faq-answer truncate">{user?.email || "student@example.com"}</p>
          </div>
        </div>

        {/* menu */}
        <nav className="flex-1">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`flex items-center gap-3 rounded-lg py-3 px-4 transition-all duration-200 font-medium ${
                      active
                        ? "border-indigo-500 border-l-4 feature-item bg-indigo-50 shadow-md"
                        : "text-gray-700 faq-answer hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-sm sidebar"
                    }`}
                    onClick={() => window.innerWidth < 1024 && toggleMobileSidebar()}
                  >
                    <span className="text-indigo-400">
                      {item.icon}
                    </span>
                    {item.label}
                    {active && (
                      <div className="ml-auto w-2 h-2 bg-indigo-400 rounded-full"></div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="pt-2 border-t singin-divider border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3  rounded-lg py-3 px-4 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 w-full font-medium logout"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;