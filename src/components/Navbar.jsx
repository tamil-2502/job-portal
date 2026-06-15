import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DarkModeToggle from "./DarkModeToggle";

export default function Navbar() {
  const { user, logout }  = useAuth();
  const navigate          = useNavigate();
  const location          = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  // Highlight active link
  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `text-sm font-medium transition-colors ${
      isActive(path)
        ? "text-indigo-600"
        : "text-gray-600 hover:text-indigo-600"
    }`;

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="text-2xl font-bold text-indigo-600 tracking-tight"
        >
          Job<span className="text-gray-800 dark:text-white">Portal</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/jobs" className={linkClass("/jobs")}>
            Browse Jobs
          </Link>
          {user?.role === "employer" && (
            <Link to="/post-job" className={linkClass("/post-job")}>
              Post a Job
            </Link>
          )}
          {user?.role === "employer" && (
            <Link to="/dashboard/employer" className={linkClass("/dashboard/employer")}>
              My Listings
            </Link>
          )}
          {user?.role === "seeker" && (
            <Link to="/dashboard/seeker" className={linkClass("/dashboard/seeker")}>
              My Applications
            </Link>
          )}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-3">
          <DarkModeToggle />
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Hi,{" "}
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  {user.name}
                </span>
                <span className="ml-2 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full capitalize">
                  {user.role}
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Right: Hamburger */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 focus:outline-none"
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-6 bg-gray-600 dark:bg-gray-300 rounded transition-all duration-300 origin-center
            ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span className={`block h-0.5 w-6 bg-gray-600 dark:bg-gray-300 rounded transition-all duration-300
            ${menuOpen ? "opacity-0 scale-x-0" : ""}`}
          />
          <span className={`block h-0.5 w-6 bg-gray-600 dark:bg-gray-300 rounded transition-all duration-300 origin-center
            ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
        ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-4 pb-5 pt-2 flex flex-col gap-1 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">

          {/* User Info */}
          {user && (
            <div className="flex items-center gap-2 py-3 mb-1 border-b border-gray-100 dark:border-gray-800">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 text-sm font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  {user.name}
                </p>
                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>
          )}

          {/* Nav Links */}
          <Link
            to="/jobs"
            onClick={closeMenu}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-2.5 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Browse Jobs
          </Link>

          {user?.role === "employer" && (
            <>
              <Link
                to="/post-job"
                onClick={closeMenu}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 py-2.5 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Post a Job
              </Link>
              <Link
                to="/dashboard/employer"
                onClick={closeMenu}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 py-2.5 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                My Listings
              </Link>
            </>
          )}

          {user?.role === "seeker" && (
            <Link
              to="/dashboard/seeker"
              onClick={closeMenu}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 py-2.5 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              My Applications
            </Link>
          )}

          {/* Auth */}
           <DarkModeToggle mobile />
          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm text-red-400 hover:text-red-600 py-2.5 px-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="block text-center bg-indigo-600 text-white text-sm px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}