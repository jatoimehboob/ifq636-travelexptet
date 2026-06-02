import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import icon from "../logo/icon.png";
const Navbar = () => {

  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {

    logout();

    navigate("/login");

  };

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

        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="/add-expense">
          Add Expense
        </Link>

        <Link to="/expenses">
          Expense List
        </Link>

        <Link to="/reports">
          Reports
        </Link>

        <Link to="/settings">
          Settings
        </Link>

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