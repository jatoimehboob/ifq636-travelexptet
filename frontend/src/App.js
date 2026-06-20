import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import ExpenseList from "./pages/ExpenseList";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import AdminUsers from "./pages/AdminUsers";

import { AuthProvider } from "./context/AuthContext";
import Categories from './pages/Categories';

import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom";
function Layout() {

  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (

    <>

      {!hideNavbar && <Navbar />}

      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
<Route
  path="/"
  element={<Navigate to="/dashboard" />}
/>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
<Route
  path="/categories"
  element={<Categories />}
/>
        <Route
          path="/add-expense"
          element={
            <ProtectedRoute>
              <AddExpense />
            </ProtectedRoute>
          }
        />

        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <ExpenseList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

      </Routes>

    </>
  );
}

function App() {

  return (

    <AuthProvider>

      <Router>

        <Layout />

      </Router>

    </AuthProvider>
  );
}

export default App;
