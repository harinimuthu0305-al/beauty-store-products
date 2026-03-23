import React, { useEffect, useState } from "react";
import { FaBox, FaShoppingCart, FaRupeeSign, FaWarehouse } from "react-icons/fa";
import API from "../../api/axios";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    totalOrders: 0,
    totalRevenue: 0,
    outOfStock: 0,
    lowStock: [],
    topProduct: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        const token = userData?.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [productsRes, ordersRes] = await Promise.all([
          API.get("/products"),
          API.get("/orders", config),
        ]);

        const products = productsRes.data;
        const orders = ordersRes.data;

        const totalStock = products.reduce((sum, p) => sum + (p.countInStock || 0), 0);
        const outOfStock = products.filter((p) => p.countInStock === 0).length;
        const lowStock = products
          .filter((p) => p.countInStock > 0 && p.countInStock <= 5)
          .slice(0, 3)
          .map((p) => ({ name: p.name, stock: p.countInStock }));

        const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

        const productSales = {};
        orders.forEach((order) => {
          order.orderItems?.forEach((item) => {
            productSales[item.name] = (productSales[item.name] || 0) + item.qty;
          });
        });
        const topProduct = Object.entries(productSales).sort((a, b) => b[1] - a[1])[0];

        setStats({
          totalProducts: products.length,
          totalStock,
          totalOrders: orders.length,
          totalRevenue: totalRevenue.toFixed(0),
          outOfStock,
          lowStock,
          topProduct: topProduct ? { name: topProduct[0], sold: topProduct[1] } : null,
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { title: "Total Products", value: stats.totalProducts, color: "#e27c9a", icon: <FaBox size={18} /> },
    { title: "Total Stock", value: stats.totalStock, color: "#6caac7", icon: <FaWarehouse size={18} /> },
    { title: "Total Orders", value: stats.totalOrders, color: "#e27c9a", icon: <FaShoppingCart size={18} /> },
    { title: "Revenue", value: `₹${stats.totalRevenue}`, color: "#6caac7", icon: <FaRupeeSign size={18} /> },
  ];

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#999" }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="container-fluid p-4 admin-container">
      <h4 className="mb-4 fw-bold">Dashboard</h4>

      {/* TOP CARDS */}
      <div className="row mb-4">
        {cards.map((card, index) => (
          <div className="col-md-3" key={index}>
            <div
              className="p-3 shadow-sm admin-card"
              style={{ background: card.color, borderRadius: "12px", cursor: "pointer" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 fw-semibold" style={{ color: "#fff", fontSize: "13px" }}>
                    {card.title}
                  </p>
                  <h5 className="mb-0 fw-bold" style={{ color: "#fff" }}>
                    {card.value}
                  </h5>
                </div>
                <div style={{ color: "#fff" }}>{card.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SECOND ROW */}
      <div className="row">

        {/* Out of Stock */}
        <div className="col-md-4">
          <div className="p-3 shadow-sm bg-white rounded admin-card">
            <h6 className="fw-bold mb-2">Out of Stock</h6>
            <h5 style={{ color: "red" }}>{stats.outOfStock} products</h5>
          </div>
        </div>

        {/* Top Selling */}
        <div className="col-md-4">
          <div className="p-3 shadow-sm bg-white rounded admin-card">
            <h6 className="fw-bold mb-2">Top Selling</h6>
            {stats.topProduct ? (
              <>
                <p className="mb-1 fw-semibold">{stats.topProduct.name}</p>
                <small>{stats.topProduct.sold} units sold</small>
              </>
            ) : (
              <p className="text-muted">No orders yet</p>
            )}
          </div>
        </div>

        {/* Low Stock */}
        <div className="col-md-4">
          <div className="p-3 shadow-sm bg-white rounded admin-card">
            <h6 className="fw-bold mb-2">Low Stock (5 or less)</h6>
            {stats.lowStock.length === 0 ? (
              <p className="text-muted">No low stock items</p>
            ) : (
              stats.lowStock.map((item, i) => (
                <div key={i} className="d-flex justify-content-between">
                  <span>{item.name}</span>
                  <span style={{ color: "orange" }}>{item.stock}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;