import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";

const Categories = () => {

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [editingId, setEditingId] =
    useState(null);

  useEffect(() => {

    fetchCategories();

  }, []);

  const fetchCategories = async () => {

    try {

      const response =
        await axiosInstance.get(
          "/categories"
        );

      setCategories(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (editingId) {

        await axiosInstance.put(
          `/categories/${editingId}`,
          formData
        );

        alert("Category updated");

      } else {

        await axiosInstance.post(
          "/categories",
          formData
        );

        alert("Category created");

      }

      setFormData({
        name: "",
        description: "",
      });

      setEditingId(null);

      fetchCategories();

    } catch (error) {
  console.log(error);
  console.log(error.response);

  alert(
    error.response?.data?.message ||
    error.message ||
    "Unknown error"
  );
}
  };

  const handleEdit = (category) => {

    setEditingId(category._id);

    setFormData({
      name: category.name,
      description:
        category.description || "",
    });

  };

  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "Delete this category?"
      )
    )
      return;

    try {

      await axiosInstance.delete(
        `/categories/${id}`
      );

      fetchCategories();

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Expense Categories
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow rounded mb-8"
      >

        <div className="mb-4">

          <label className="block mb-2">
            Category Name
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
            className="w-full border p-3 rounded"
            required
          />

        </div>

        <div className="mb-4">

          <label className="block mb-2">
            Description
          </label>

          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description:
                  e.target.value,
              })
            }
            className="w-full border p-3 rounded"
          />

        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >

          {editingId
            ? "Update Category"
            : "Add Category"}

        </button>

      </form>

      <div className="bg-white shadow rounded p-6">

        <table className="w-full">

          <thead>

            <tr>

              <th className="text-left p-3">
                Name
              </th>

              <th className="text-left p-3">
                Description
              </th>

              <th className="text-left p-3">
                Status
              </th>

              <th className="text-left p-3">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {categories.map(
              (category) => (

                <tr
                  key={category._id}
                  className="border-t"
                >

                  <td className="p-3">
                    {category.name}
                  </td>

                  <td className="p-3">
                    {
                      category.description
                    }
                  </td>

                  <td className="p-3">
                    {category.status}
                  </td>

                  <td className="p-3">

                    <button
                      onClick={() =>
                        handleEdit(
                          category
                        )
                      }
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          category._id
                        )
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Categories;