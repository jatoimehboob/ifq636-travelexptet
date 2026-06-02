import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";

const ExpenseList = () => {

  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);

  // Fetch Expenses
  const fetchExpenses = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axiosInstance.get(
        "/api/expenses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExpenses(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Delete Expense
  const deleteExpense = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await axiosInstance.delete(
        `/api/expenses/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchExpenses();

    } catch (error) {

      console.log(error);

    }
  };

  // Update Expense
  const updateExpense = async () => {

    try {

      const token = localStorage.getItem("token");

      await axiosInstance.put(
        `/api/expenses/${editingExpense._id}`,
        editingExpense,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditingExpense(null);

      fetchExpenses();

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <div className="p-6 w-full bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-8">
        Expense List
      </h1>

      <div className="bg-white rounded shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-blue-600 text-white">

            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Action</th>
            </tr>

          </thead>

          <tbody>

            {expenses.map((expense) => (

              <tr
                key={expense._id}
                className="border-b"
              >

                <td className="p-4">

                  {editingExpense?._id === expense._id ? (

                    <input
                      value={editingExpense.title}
                      onChange={(e) =>
                        setEditingExpense({
                          ...editingExpense,
                          title: e.target.value,
                        })
                      }
                      className="border p-2 rounded"
                    />

                  ) : (
                    expense.title
                  )}

                </td>

                <td className="p-4">

                  {editingExpense?._id === expense._id ? (

                    <input
                      type="number"
                      value={editingExpense.amount}
                      onChange={(e) =>
                        setEditingExpense({
                          ...editingExpense,
                          amount: e.target.value,
                        })
                      }
                      className="border p-2 rounded"
                    />

                  ) : (
                    `$${expense.amount}`
                  )}

                </td>

                <td className="p-4">

                  {editingExpense?._id === expense._id ? (

                    <input
                      value={editingExpense.category}
                      onChange={(e) =>
                        setEditingExpense({
                          ...editingExpense,
                          category: e.target.value,
                        })
                      }
                      className="border p-2 rounded"
                    />

                  ) : (
                    expense.category
                  )}

                </td>

                <td className="p-4">

                  {editingExpense?._id === expense._id ? (

                    <input
                      type="date"
                      value={
                        editingExpense.date
                          ? editingExpense.date.substring(0, 10)
                          : ""
                      }
                      onChange={(e) =>
                        setEditingExpense({
                          ...editingExpense,
                          date: e.target.value,
                        })
                      }
                      className="border p-2 rounded"
                    />

                  ) : (
                    new Date(expense.date).toLocaleDateString()
                  )}

                </td>

                <td className="p-4 flex gap-2">

                  {editingExpense?._id === expense._id ? (

                    <button
                      onClick={updateExpense}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>

                  ) : (

                    <button
                      onClick={() => setEditingExpense(expense)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                  )}

                  <button
                    onClick={() => {

                      const confirmDelete = window.confirm(
                        "Are you sure you want to delete this expense?"
                      );

                      if (confirmDelete) {
                        deleteExpense(expense._id);
                      }

                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default ExpenseList;