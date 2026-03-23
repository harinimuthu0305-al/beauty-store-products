import React, { useEffect, useState } from "react";

function Users() {

  const API = "http://localhost:4000/api/users";

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Customer"
  });

  // ✅ FETCH USERS
  const fetchUsers = async () => {
    try {
      const res = await fetch(API);

      if (!res.ok) {
        throw new Error("API not working");
      }

      const data = await res.json();

      // SAFE CHECK
      setUsers(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error("Fetch error:", err);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ ADD / UPDATE USER
  const handleSave = async () => {

    if (!newUser.name || !newUser.email) {
      return alert("Please fill all fields");
    }

    try {
      if (editId) {
        // UPDATE
        await fetch(`${API}/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newUser)
        });
      } else {
        // ADD
        await fetch(API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newUser)
        });
      }

      // RESET
      setNewUser({ name: "", email: "", role: "Customer" });
      setEditId(null);
      setShowForm(false);

      fetchUsers();

    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // ✅ DELETE USER
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      fetchUsers();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ✅ EDIT USER
  const handleEdit = (user) => {
    setNewUser({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "Customer"
    });

    setEditId(user._id);
    setShowForm(true);
  };

  // ✅ SEARCH
  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-3">

      <h3 className="mb-3">Users</h3>

      {/* SEARCH + ADD */}
      <div className="d-flex justify-content-between mb-3">

        <input
          type="text"
          placeholder="Search user..."
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
          + Add User
        </button>

      </div>

      {/* FORM */}
      {showForm && (
        <div className="card p-3 mb-3">

          <h5>{editId ? "Edit User" : "Add User"}</h5>

          <div className="row">

            <div className="col-md-4">
              <input
                type="text"
                placeholder="Name"
                className="form-control mb-2"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
              />
            </div>

            <div className="col-md-4">
              <input
                type="email"
                placeholder="Email"
                className="form-control mb-2"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
            </div>

            <div className="col-md-3">
              <select
                className="form-control mb-2"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
              >
                <option>Admin</option>
                <option>Customer</option>
              </select>
            </div>

            <div className="col-md-1">
              <button className="btn btn-success" onClick={handleSave}>
                {editId ? "Update" : "Save"}
              </button>
            </div>

          </div>

        </div>
      )}

      {/* TABLE */}
      <table className="table table-bordered bg-white">

        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {filteredUsers.length > 0 ? (
            filteredUsers.map((u) => (
              <tr key={u._id}>
                <td>{u._id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>

                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(u)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(u._id)}
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No users found
              </td>
            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
}

export default Users