import { useState } from "react";
import axiosInstance from "../axiosConfig";
import { useNavigate } from "react-router-dom";
const AddExpense = () => {
const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    paymentMethod: "",
    date: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      await axiosInstance.post(
  "/api/expenses",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
alert("Expense added successfully");

navigate("/expenses");

    } catch (error) {
      console.log(error);
    }
  };

  return (

    <div className="p-6 w-full bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-8">
        Add Expense
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow max-w-2xl"
      >

        <div className="mb-4">

          <input
            type="text"
            name="title"
            placeholder="Expense Title"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

        </div>

        <div className="mb-4">

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

        </div>

        <div className="mb-4">

          <input
            type="text"
            name="category"
            placeholder="Category"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

        </div>

        <div className="mb-4">

          <input
            type="text"
            name="paymentMethod"
            placeholder="Payment Method"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

        </div>

        <div className="mb-4">

          <input
            type="date"
            name="date"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

        </div>

        <div className="mb-4">

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="w-full border p-3 rounded"
          />

        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Save Expense
        </button>

      </form>

    </div>
  );
};

export default AddExpense;