import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white border-r p-5">
      <h1 className="text-2xl font-bold text-blue-600 mb-10">
        Travel Expense Tracker
      </h1>

      <div className="flex flex-col gap-4">

        <Link to="/dashboard">Dashboard</Link>

        <Link to="/add-expense">Add Expense</Link>

        <Link to="/expenses">Expense List</Link>

        <Link to="/reports">Reports</Link>

        <Link to="/settings">Settings</Link>

      </div>
    </div>
  );
}