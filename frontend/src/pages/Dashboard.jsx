import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { isAdmin } from "../utils/auth";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const PIE_COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#3b82f6",
  "#8b5cf6",
  "#ef4444",
  "#14b8a6",
  "#f97316",
];

const StatCard = ({ icon, iconBg, iconColor, label, value }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm flex gap-4 items-start">
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}
    >
      <span className={`text-xl ${iconColor}`}>{icon}</span>
    </div>
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

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
      if (admin) requests.push(axiosInstance.get("/users", authHeader));

      const results = await Promise.all(requests);
      setExpenses(results[0].data);
      setCategories(results[1].data);
      if (admin && results[2]) setUserCount(results[2].data.length);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (value) => {
    const match = categories.find((c) => c._id === value);
    return match ? match.name : value;
  };

  const now = new Date();

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const currentMonthTotal = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const categoryTotals = expenses.reduce((acc, e) => {
    const name = getCategoryName(e.category);
    acc[name] = (acc[name] || 0) + Number(e.amount);
    return acc;
  }, {});

  const pieData = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const monthlyData = (() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString("default", { month: "short" });
      const total = expenses
        .filter((e) => {
          const ed = new Date(e.date);
          return (
            ed.getMonth() === d.getMonth() &&
            ed.getFullYear() === d.getFullYear()
          );
        })
        .reduce((sum, e) => sum + Number(e.amount), 0);
      months.push({ month: label, amount: total });
    }
    return months;
  })();

  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* SUMMARY CARDS */}
      <div
        className={`grid gap-5 mb-8 ${
          admin ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1 sm:grid-cols-3"
        }`}
      >
        <StatCard
          icon="$"
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          label="Total Expenses"
          value={`$${totalExpenses.toFixed(2)}`}
        />
        <StatCard
          icon="↗"
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          label="Monthly Spending"
          value={`$${currentMonthTotal.toFixed(2)}`}
        />
        <StatCard
          icon="☰"
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          label="Categories"
          value={categories.length}
        />
        {admin && (
          <StatCard
            icon="✈"
            iconBg="bg-orange-50"
            iconColor="text-orange-500"
            label="Total Users"
            value={userCount ?? 0}
          />
        )}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Area chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Monthly Spending Overview
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart
              data={monthlyData}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                formatter={(v) => [`$${v.toFixed(2)}`, "Spending"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#spendGrad)"
                dot={false}
                activeDot={{ r: 5, fill: "#6366f1" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Expense Category  
          </h2>
          {pieData.length === 0 ? (
            <p className="text-gray-400 text-sm">No expenses to display.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => [`$${v.toFixed(2)}`]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ fontSize: "13px", paddingTop: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* RECENT EXPENSES */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Expenses
        </h2>
        {recentExpenses.length === 0 ? (
          <p className="text-gray-400 text-sm">No expenses recorded yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentExpenses.map((expense) => (
              <div
                key={expense._id}
                className="flex justify-between items-center py-3"
              >
                <div>
                  <p className="font-medium text-gray-800">{expense.title}</p>
                  <p className="text-sm text-gray-400">
                    {getCategoryName(expense.category)} ·{" "}
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
                <span className="font-semibold text-indigo-600">
                  ${Number(expense.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
