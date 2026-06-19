import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { getCurrentUser } from "../utils/auth";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const currentUser = getCurrentUser();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axiosInstance.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(response.data);
    } catch (error) {
      if (error.response?.status === 403) {
        setAccessDenied(true);
      } else {
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      const token = localStorage.getItem("token");

      await axiosInstance.put(
        `/users/${id}/role`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update role");
    }
  };

  const handleStatusToggle = async (id, isActive) => {
    try {
      const token = localStorage.getItem("token");

      await axiosInstance.put(
        `/users/${id}/status`,
        { isActive: !isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (accessDenied) {
    return (
      <div className="p-6 w-full bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600">
          You need administrator access to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 w-full bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Manage Users</h1>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => {
              const isSelf = user._id === currentUser?.id;

              return (
                <tr key={user._id} className="border-b">
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>

                  <td className="p-4">
                    <select
                      value={user.role}
                      disabled={isSelf}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="border p-2 rounded disabled:bg-gray-100"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="p-4">
                    <button
                      disabled={isSelf}
                      onClick={() => handleStatusToggle(user._id, user.isActive)}
                      className={`px-3 py-1 rounded text-white disabled:opacity-40 ${
                        user.isActive
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
