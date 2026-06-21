import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";

const Reports = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axiosInstance.get("/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setExpenses(response.data);
      setFilteredExpenses(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axiosInstance.get("/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Resolves a category id to its name, falling back to the raw value
  // for older records that stored the category name directly.
  const getCategoryName = (categoryValue) => {
    const match = categories.find((cat) => cat._id === categoryValue);
    return match ? match.name : categoryValue;
  };

  const filterReports = () => {
    let filtered = expenses;

    if (startDate) {
      filtered = filtered.filter(
        (expense) => new Date(expense.date) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (expense) => new Date(expense.date) <= new Date(endDate)
      );
    }

    setFilteredExpenses(filtered);
  };

  const totalExpense = filteredExpenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  // Group filtered expenses by category name and sum their amounts
  const categoryTotals = filteredExpenses.reduce((acc, expense) => {
    const name = getCategoryName(expense.category);
    acc[name] = (acc[name] || 0) + Number(expense.amount);
    return acc;
  }, {});

  const sortedCategoryTotals = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Expense Reports</h1>

      {/* FILTERS */}
      <div className="bg-white p-6 rounded shadow mb-8 flex gap-4 items-end">
        <div>
          <label className="block mb-2 font-medium">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-3 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-3 rounded"
          />
        </div>

        <button
          onClick={filterReports}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Filter Report
        </button>
      </div>

      {/* TOTAL */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-2xl font-semibold mb-2">Total Expenses</h2>
        <p className="text-4xl text-blue-600 font-bold">
          ${totalExpense.toFixed(2)}
        </p>
      </div>

      {/* CATEGORY BREAKDOWN */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">Expenses by Category</h2>

        {sortedCategoryTotals.length === 0 ? (
          <p className="text-gray-500">No expenses to summarize yet.</p>
        ) : (
          <div className="space-y-3">
            {sortedCategoryTotals.map(([name, amount]) => {
              const percent =
                totalExpense > 0 ? (amount / totalExpense) * 100 : 0;

              return (
                <div key={name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{name}</span>
                    <span className="text-blue-600 font-semibold">
                      ${amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded h-2">
                    <div
                      className="bg-blue-600 h-2 rounded"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white p-6 rounded shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Amount</th>
              <th className="text-left p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredExpenses.length === 0 ? (
              <tr>
                <td className="p-3 text-gray-500" colSpan={4}>
                  No expenses found for the selected range.
                </td>
              </tr>
            ) : (
              filteredExpenses.map((expense) => (
                <tr key={expense._id} className="border-b">
                  <td className="p-3">{expense.title}</td>
                  <td className="p-3">{getCategoryName(expense.category)}</td>
                  <td className="p-3">${expense.amount}</td>
                  <td className="p-3">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
