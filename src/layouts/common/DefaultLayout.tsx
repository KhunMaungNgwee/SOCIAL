import { useNavigate, Outlet, NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { FaHome, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const DefaultLayout = () => {
  const { isAuthenticated, userLogout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  console.log("Default", isAuthenticated);
  if (!isAuthenticated) {
    navigate("/auth/login", { replace: true });
    return null;
  }

  const handleLogout = () => {
    userLogout();
    navigate("/auth/login", { replace: true });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Title */}
            <div className="flex items-center">
              <div className="text-xl font-bold text-gray-800">SOCIAL</div>
            </div>

            {/* Desktop Middle: Tabs */}
            <div className="hidden md:flex items-center space-x-4 mx-4 flex-1 justify-center">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-gray-100 text-gray-900 font-medium" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <FaHome className="h-4 w-4" />
                <span>Home</span>
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-gray-100 text-gray-900 font-medium" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <FaUser className="h-4 w-4" />
                <span>Profile</span>
              </NavLink>
            </div>

            {/* Desktop Right: Logout */}
            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors border border-gray-300"
              >
                <FaSignOutAlt className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLink
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg ${
                    isActive 
                      ? "bg-gray-100 text-gray-900 font-medium" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <FaHome className="h-4 w-4" />
                <span>Home</span>
              </NavLink>
              <NavLink
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg ${
                    isActive 
                      ? "bg-gray-100 text-gray-900 font-medium" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <FaUser className="h-4 w-4" />
                <span>Profile</span>
              </NavLink>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center space-x-3 w-full text-left px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <FaSignOutAlt className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DefaultLayout;