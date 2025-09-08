import { Link } from "react-router";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
const LandingPageNavbar = () => {
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
    <nav className="landing-navbar py-2 bg-indigo-50/90 border-b border-gray-200 sticky top-0 z-50">
      <div className="relative z-10 w-full px-4 lg:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <p className="font-bold text-white text-xl">S</p>
            </div>
            <h1 className="text-2xl font-bold text-indigo-800 transition-colors">
              StudyMate
            </h1>
          </Link>

          <div className="flex items-center md:gap-4 gap-2">
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

            <Link
              to="/login"
              className="signin-btn text-sm font-medium py-2 px-5 rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-600 hover:to-indigo-600 transition duration-250 shadow-md hover:shadow-lg"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default LandingPageNavbar;