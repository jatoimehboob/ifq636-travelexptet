import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import icon from "../logo/icon.png";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close the dropdown when clicking anywhere outside it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-blue-600 text-white px-8 py-4 flex justify-between items-center shadow">
      <div className="flex items-center">
        <img
          src={icon}
          alt="Logo"
          className="w-25 h-14 object-contain"
        />

        <h1 className="text-2xl font-bold">
          Travel Expense Tracker
        </h1>
      </div>

      <div className="flex gap-6 items-center">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/add-expense">Add Expense</Link>
        <Link to="/expenses">Expense List</Link>
        <Link to="/reports">Reports</Link>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setSettingsOpen((prev) => !prev)}
            className="flex items-center gap-1"
          >
            Settings
            <span className={`text-xs transition-transform ${settingsOpen ? "rotate-180" : ""}`}>
              ▾
            </span>
          </button>

          {settingsOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded shadow-lg overflow-hidden z-10">
              <Link
                to="/categories"
                onClick={() => setSettingsOpen(false)}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Categories
              </Link>

              <Link
                to="/settings"
                onClick={() => setSettingsOpen(false)}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                My Profile
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
