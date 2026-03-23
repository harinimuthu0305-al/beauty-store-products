import React, { useEffect, useState } from "react";
import API from "../../api/axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    countInStock: "",
    brand: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Only JPG, PNG, WEBP images allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (!newProduct.name || !newProduct.price || !newProduct.countInStock || !newProduct.category) {
      setError("Please fill all required fields");
      return;
    }
    if (!editId && !imageFile) {
      setError("Please select a product image");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("category", newProduct.category);
      formData.append("price", newProduct.price);
      formData.append("countInStock", newProduct.countInStock);
      formData.append("brand", newProduct.brand);
      formData.append("description", newProduct.description);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.token;

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      if (editId) {
        await API.put(`/products/${editId}`, formData, config);
        setSuccess("Product updated successfully!");
      } else {
        await API.post("/products", formData, config);
        setSuccess("Product added successfully!");
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.token;
      await API.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Product deleted!");
      fetchProducts();
    } catch (err) {
      setError("Failed to delete product");
    }
  };

  const handleEdit = (p) => {
    setNewProduct({
      name: p.name || "",
      category: p.category || "",
      price: p.price || "",
      countInStock: p.countInStock || "",
      brand: p.brand || "",
      description: p.description || "",
    });
    setImagePreview(p.image || "");
    setImageFile(null);
    setEditId(p._id);
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setNewProduct({
      name: "",
      category: "",
      price: "",
      countInStock: "",
      brand: "",
      description: "",
    });
    setImageFile(null);
    setImagePreview("");
    setEditId(null);
  };

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <h2 style={{ marginBottom: "20px" }}>
        {editId ? "Edit Product" : "Add Product"}
      </h2>

      {error && (
        <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px 14px", borderRadius: "8px", marginBottom: "12px" }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: "#dcfce7", color: "#166534", padding: "10px 14px", borderRadius: "8px", marginBottom: "12px" }}>
          {success}
        </div>
      )}

      <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px", marginBottom: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <input placeholder="Product Name *" value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} style={inputStyle} />
          <input placeholder="Category *" value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} style={inputStyle} />
          <input type="number" placeholder="Price (₹) *" value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} style={inputStyle} />
          <input type="number" placeholder="Stock *" value={newProduct.countInStock}
            onChange={(e) => setNewProduct({ ...newProduct, countInStock: e.target.value })} style={inputStyle} />
          <input placeholder="Brand" value={newProduct.brand}
            onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })} style={inputStyle} />
          <input placeholder="Description" value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} style={inputStyle} />
        </div>

        <div style={{ marginTop: "16px" }}>
          <label style={{ display: "block", fontSize: "14px", color: "#374151", marginBottom: "8px", fontWeight: "500" }}>
            Product Image {!editId && "*"}
          </label>
          <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageChange} style={{ fontSize: "14px" }} />
          {imagePreview && (
            <div style={{ marginTop: "12px" }}>
              <img src={imagePreview} alt="Preview"
                style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px", border: "1px solid #e5e7eb" }} />
              <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                {imageFile ? "New image selected" : "Current image"}
              </p>
            </div>
          )}
        </div>

        <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
          <button onClick={handleSave} disabled={saving}
            style={{ ...btnStyle, background: saving ? "#9ca3af" : "#4f46e5", color: "#fff", cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "Saving..." : editId ? "Update Product" : "Add Product"}
          </button>
          {editId && (
            <button onClick={resetForm} style={{ ...btnStyle, background: "#f3f4f6", color: "#374151" }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <input placeholder="Search products..." value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ ...inputStyle, width: "300px", marginBottom: "16px" }} />

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              <th style={thStyle}>Image</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Brand</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "20px", color: "#9ca3af" }}>
                  No products found
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={tdStyle}>
                    <img src={p.image} alt={p.name} width="55" height="55"
                      style={{ objectFit: "cover", borderRadius: "6px" }} />
                  </td>
                  <td style={tdStyle}>{p.name}</td>
                  <td style={tdStyle}>{p.category}</td>
                  <td style={tdStyle}>{p.brand}</td>
                  <td style={tdStyle}>₹{p.price}</td>
                  <td style={tdStyle}>{p.countInStock}</td>
                  <td style={tdStyle}>
                    <button onClick={() => handleEdit(p)}
                      style={{ ...btnStyle, background: "#e0e7ff", color: "#3730a3", marginRight: "6px" }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p._id)}
                      style={{ ...btnStyle, background: "#fee2e2", color: "#991b1b" }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

const inputStyle = { padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", width: "100%", boxSizing: "border-box", outline: "none" };
const btnStyle = { padding: "9px 18px", borderRadius: "8px", border: "none", fontSize: "14px", fontWeight: "500", cursor: "pointer" };
const thStyle = { padding: "10px 12px", textAlign: "left", fontWeight: "600", color: "#374151", borderBottom: "2px solid #e5e7eb" };
const tdStyle = { padding: "10px 12px", color: "#374151", verticalAlign: "middle" };

export default Products;