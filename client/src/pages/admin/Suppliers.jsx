import React, { useState } from "react";

function Suppliers() {

  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: "Lakme",
      email: "lakme@gmail.com",
      phone: "9876543210",
      address: "Mumbai"
    },
    {
      id: 2,
      name: "Maybelline",
      email: "maybelline@gmail.com",
      phone: "9876501234",
      address: "Delhi"
    }
  ]);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [newSupplier, setNewSupplier] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  // ➕ ADD / UPDATE
  const handleSave = () => {

    if (!newSupplier.name) return alert("Enter supplier name");

    if (editId) {
      // UPDATE
      const updated = suppliers.map((s) =>
        s.id === editId ? { ...newSupplier, id: editId } : s
      );
      setSuppliers(updated);
      setEditId(null);
    } else {
      // ADD
      setSuppliers([
        ...suppliers,
        { ...newSupplier, id: Date.now() }
      ]);
    }

    setNewSupplier({
      name: "",
      email: "",
      phone: "",
      address: ""
    });

    setShowForm(false);
  };

  // ✏️ EDIT
  const handleEdit = (supplier) => {
    setNewSupplier(supplier);
    setEditId(supplier.id);
    setShowForm(true);
  };

  // ❌ DELETE
  const handleDelete = (id) => {
    setSuppliers(suppliers.filter((s) => s.id !== id));
  };

  // 🔍 FILTER
  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>

      <h3 className="mb-3">Suppliers</h3>

      {/* 🔍 SEARCH + ADD BUTTON */}
      <div className="d-flex justify-content-between mb-3">

        <input
          type="text"
          placeholder="Search supplier..."
          className="form-control w-50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
          }}
        >
          + Add Supplier
        </button>

      </div>

      {/* 📋 FORM */}
      {showForm && (
        <div className="card p-3 mb-3">

          <h5>{editId ? "Edit Supplier" : "Add Supplier"}</h5>

          <div className="row">

            <div className="col-md-3">
              <input
                type="text"
                placeholder="Name"
                className="form-control mb-2"
                value={newSupplier.name}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, name: e.target.value })
                }
              />
            </div>

            <div className="col-md-3">
              <input
                type="email"
                placeholder="Email"
                className="form-control mb-2"
                value={newSupplier.email}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, email: e.target.value })
                }
              />
            </div>

            <div className="col-md-2">
              <input
                type="text"
                placeholder="Phone"
                className="form-control mb-2"
                value={newSupplier.phone}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, phone: e.target.value })
                }
              />
            </div>

            <div className="col-md-3">
              <input
                type="text"
                placeholder="Address"
                className="form-control mb-2"
                value={newSupplier.address}
                onChange={(e) =>
                  setNewSupplier({ ...newSupplier, address: e.target.value })
                }
              />
            </div>

            <div className="col-md-1">
              <button className="btn btn-success" onClick={handleSave}>
                {editId ? "Update" : "Save"}
              </button>
            </div>

          </div>

        </div>
      )}

      {/* 📋 TABLE */}
      <table className="table table-bordered bg-white">

        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {filteredSuppliers.length > 0 ? (
            filteredSuppliers.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.phone}</td>
                <td>{s.address}</td>

                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(s)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(s.id)}
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No suppliers found
              </td>
            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
}

export default Suppliers;



