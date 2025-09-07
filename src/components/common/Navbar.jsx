import { useContext, useEffect, useState } from "react";
import { FiMenu, FiBell } from "react-icons/fi";
import { Sun, Moon } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router";

const Navbar = ({ toggleMobileSidebar }) => {
  const { user } = useContext(AuthContext);

  const [theme, setTheme] = useState(
      localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
    );
  
    const handleToggle = () => {
      setTheme(theme === "light" ? "dark" : "light");
    };
  
    useEffect(() => {
      localStorage.setItem("theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

  return (
    <div className="py-3 landing-navbar bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
      <div className="w-full mx-auto px-4 flex items-center justify-between">
        {/* left side */}
        <div className="flex items-center">
          <button
            className="lg:hidden mr-3 p-2 rounded-md text-gray-500 hover:bg-indigo-50 transition-colors cursor-pointer"
            onClick={toggleMobileSidebar}
          >
            <FiMenu size={20} />
          </button>
          
          <Link to="/dashboard" className="flex gap-2 items-center lg:hidden">
           <div className="h-10 w-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-indigo-800">StudyMate</h1>
          </Link>
        </div>

        {/* right side */}
        <div className="flex items-center gap-4">
          <button
              onClick={handleToggle}
              className="theme-toggle-btn relative w-14 h-7 flex items-center rounded-full p-1 bg-gray-200 transition-all duration-300"
              aria-label="Toggle dark mode"
            >
              <div
                className={`toggle-handle absolute transform transition-transform duration-300 ${
                  theme === "dark" ? "translate-x-7" : "translate-x-0"
                } w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center`}
              >
                {theme === "dark" ? (
                  <Moon size={12} className="text-gray-700" />
                ) : (
                  <Sun size={12} className="text-yellow-500" />
                )}
              </div>
            </button>
          
          {user && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-indigo-100">
                <img
                  src={
                    user?.photoURL ||
                    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                  }
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium faq-question text-gray-700 hidden sm:inline-block">
                {user?.displayName || "Account"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;