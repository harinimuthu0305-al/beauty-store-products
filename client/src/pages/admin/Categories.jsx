import React, { useState } from "react";

function Categories() {

  const [categories, setCategories] = useState([
    { id: 1, name: "Skincare" },
    { id: 2, name: "Makeup" },
    { id: 3, name: "Haircare" }
  ]);

  const [newCategory, setNewCategory] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  // ➕ ADD / UPDATE
  const handleSave = () => {

    if (!newCategory) return alert("Enter category name");

    if (editId) {
      // UPDATE
      const updated = categories.map((c) =>
        c.id === editId ? { ...c, name: newCategory } : c
      );
      setCategories(updated);
      setEditId(null);
    } else {
      // ADD
      setCategories([
        ...categories,
        { id: Date.now(), name: newCategory }
      ]);
    }

    setNewCategory("");
  };

  // ✏️ EDIT
  const handleEdit = (cat) => {
    setNewCategory(cat.name);
    setEditId(cat.id);
  };

  // ❌ DELETE
  const handleDelete = (id) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  // 🔍 SEARCH
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>

      <h3 className="mb-3">Categories</h3>

      {/* 🔍 SEARCH + INPUT */}
      <div className="d-flex justify-content-between mb-3">

        <input
          type="text"
          placeholder="Search category..."
          className="form-control w-50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="d-flex gap-2">

          <input
            type="text"
            placeholder="Add category"
            className="form-control"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />

          <button className="btn btn-primary" onClick={handleSave}>
            {editId ? "Update" : "Add"}
          </button>

        </div>

      </div>

      {/* 📋 TABLE */}

      <table className="table table-bordered bg-white">

        <thead>
          <tr>
            <th>Category Name</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {filteredCategories.length > 0 ? (
            filteredCategories.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>

                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(c)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center">
                No categories found
              </td>
            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
}

export default Categories;