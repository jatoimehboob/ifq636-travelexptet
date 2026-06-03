import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";

const Settings = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await axiosInstance.get(
          "/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          password: "",
        });

      } catch (error) {

        console.log(error);

      }
    };

    fetchProfile();

  }, []);

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      await axiosInstance.put(
        "/auth/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile updated successfully");

    } catch (error) {

      console.log(error);

      alert("Update failed");

    }
  };

  return (

    <div className="p-6 w-full bg-gray-100 min-h-screen">

      <h1 className="text-4xl font-bold mb-8">
        Settings
      </h1>

      <div className="bg-white p-8 rounded shadow max-w-4xl">

        <form onSubmit={handleSubmit}>

          <div className="mb-5">

            <label className="block mb-2 font-medium">
              Full Name
            </label>

            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="w-full border p-4 rounded"
            />

          </div>

          <div className="mb-5">

            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              className="w-full border p-4 rounded"
            />

          </div>

          <div className="mb-5">

            <label className="block mb-2 font-medium">
              New Password
            </label>

            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              className="w-full border p-4 rounded"
            />

          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded"
          >
            Save Changes
          </button>

        </form>

      </div>

    </div>
  );
};

export default Settings;