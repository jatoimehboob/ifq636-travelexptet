import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";

const Register = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await axiosInstance.post(
        "/api/auth/register",
        formData
      );

      alert("Registration successful");

      navigate("/login");

    } catch (error) {

      alert("Registration failed");

    }
  };

  return (

    <div className="min-h-screen flex">

      {/* LEFT SIDE */}

      <div className="w-1/2 bg-white flex items-center justify-center">

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-10"
        >

          <h1 className="text-5xl font-bold text-blue-600 mb-4">
            Register
          </h1>

          <p className="text-gray-500 mb-10">
            Create your account to get started
          </p>

          <div className="mb-5">

            <label className="block mb-2 font-medium">
              Full Name
            </label>

            <input
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="w-full border rounded p-4"
            />

          </div>

          <div className="mb-5">

            <label className="block mb-2 font-medium">
              Email Address
            </label>

            <input
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              className="w-full border rounded p-4"
            />

          </div>

          <div className="mb-6">

            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              className="w-full border rounded p-4"
            />

          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded text-lg"
          >
            Create Account
          </button>

          <p className="mt-6 text-center">

            Already have an account?

            <Link
              to="/login"
              className="text-blue-600 ml-2"
            >
              Sign In
            </Link>

          </p>

        </form>

      </div>

      {/* RIGHT SIDE */}

      <div className="w-1/2 bg-blue-700 text-white flex flex-col justify-center items-center p-16">

       

        <h3 className="text-6xl font-bold mb-8">
         Travel Expense Tracker
        </h3>

        

        <div className="space-y-6 w-full max-w-xl">

          <div className="bg-blue-500/40 p-6 rounded-2xl">
            <h2 className="text-2xl font-semibold">
              ✔ Real-time Tracking
            </h2>
            <p className="mt-2 text-lg">
              Monitor all your expenses
            </p>
          </div>

          <div className="bg-blue-500/40 p-6 rounded-2xl">
            <h2 className="text-2xl font-semibold">
              ✔ Detailed Reports
            </h2>
            <p className="mt-2 text-lg">
              Generate your expense reports
            </p>
          </div>

          <div className="bg-blue-500/40 p-6 rounded-2xl">
            <h2 className="text-2xl font-semibold">
              ✔ Secure & Private
            </h2>
            <p className="mt-2 text-lg">
              Your data is encrypted and protected
            </p>
          </div>

        </div>

      </div>


    </div>
  );
};

export default Register;