import { useContext } from "react";
import { FiMenu, FiBell } from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";

const Navbar = ({ toggleMobileSidebar }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="py-3 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
      <div className="w-full mx-auto px-4 flex items-center justify-between">
        {/* left side */}
        <div className="flex items-center">
          <button
            className="lg:hidden mr-3 p-2 rounded-md text-gray-500 hover:bg-indigo-50 transition-colors"
            onClick={toggleMobileSidebar}
          >
            <FiMenu size={20} />
          </button>
          
          <div className="flex gap-2 items-center lg:hidden">
           <div className="h-10 w-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-indigo-800">StudyMate</h1>
          </div>
        </div>

        {/* right side */}
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full text-gray-500 hover:bg-indigo-50 transition-colors relative">
            <FiBell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
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
              <span className="text-sm font-medium text-gray-700 hidden sm:inline-block">
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