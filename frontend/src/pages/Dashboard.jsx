import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { isAdmin } from "../utils/auth";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userCount, setUserCount] = useState(null);
  const [loading, setLoading] = useState(true);

  const admin = isAdmin();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const authHeader = { headers: { Authorization: `Bearer ${token}` } };

      const requests = [
        axiosInstance.get("/expenses", authHeader),
        axiosInstance.get("/categories", authHeader),
      ];

      // Only admins are authorized to hit /users, so only ask if we are one
      if (admin) {
        requests.push(axiosInstance.get("/users", authHeader));
      }

      const results = await Promise.all(requests);

      setExpenses(results[0].data);
      setCategories(results[1].data);

      if (admin && results[2]) {
        setUserCount(results[2].data.length);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Resolves a category id to its name, falling back to the raw value
  // for older records that stored the category name directly.
  const getCategoryName = (categoryValue) => {
    const match = categories.find((cat) => cat._id === categoryValue);
    return match ? match.name : categoryValue;
  };

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  const now = new Date();
  const currentMonthTotal = expenses
    .filter((expense) => {
      const d = new Date(expense.date);
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, expense) => sum + Number(expense.amount), 0);

  const categoryTotals = expenses.reduce((acc, expense) => {
    const name = getCategoryName(expense.category);
    acc[name] = (acc[name] || 0) + Number(expense.amount);
    return acc;
  }, {});

  const sortedCategoryTotals = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  );

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      {/* SUMMARY CARDS */}
      <div
        className={`grid grid-cols-2 ${
          admin ? "md:grid-cols-4" : "md:grid-cols-3"
        } gap-6 mb-8`}
      >
        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500 mb-1">Total Expenses</p>
          <p className="text-3xl font-bold text-blue-600">
            ${totalExpenses.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500 mb-1">This Month</p>
          <p className="text-3xl font-bold text-blue-600">
            ${currentMonthTotal.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500 mb-1">Categories</p>
          <p className="text-3xl font-bold text-blue-600">
            {categories.length}
          </p>
        </div>

        {admin && (
          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-500 mb-1">Users</p>
            <p className="text-3xl font-bold text-blue-600">
              {userCount ?? 0}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EXPENSE BY CATEGORY */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-semibold mb-4">
            Expenses by Category
          </h2>

          {sortedCategoryTotals.length === 0 ? (
            <p className="text-gray-500">No expenses recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {sortedCategoryTotals.map(([name, amount]) => (
                <div
                  key={name}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <span className="font-medium">{name}</span>
                  <span className="text-blue-600 font-semibold">
                    ${amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RECENT EXPENSES */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-semibold mb-4">Recent Expenses</h2>

          {recentExpenses.length === 0 ? (
            <p className="text-gray-500">No expenses recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {recentExpenses.map((expense) => (
                <div
                  key={expense._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{expense.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-blue-600 font-semibold">
                    ${Number(expense.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
