import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaSignOutAlt,
  FaTruck,
} from "react-icons/fa";

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* SIDEBAR */}
      <div style={sidebarStyle}>
        <h5 style={{ marginBottom: "24px", fontSize: "16px", fontWeight: "700", color: "#e91e63" }}>
          Admin Panel
        </h5>

        <Link to="/admin/dashboard" style={linkStyle}>
          <div style={menuStyle(isActive("/admin/dashboard"))}>
            <FaTachometerAlt size={16} /> Dashboard
          </div>
        </Link>

        <Link to="/admin/products" style={linkStyle}>
          <div style={menuStyle(isActive("/admin/products"))}>
            <FaBox size={16} /> Products
          </div>
        </Link>

        <Link to="/admin/orders" style={linkStyle}>
          <div style={menuStyle(isActive("/admin/orders"))}>
            <FaShoppingCart size={16} /> Orders
          </div>
        </Link>

        <Link to="/admin/suppliers" style={linkStyle}>
          <div style={menuStyle(isActive("/admin/suppliers"))}>
            <FaTruck size={16} /> Suppliers
          </div>
        </Link>

        <Link to="/admin/users" style={linkStyle}>
          <div style={menuStyle(isActive("/admin/users"))}>
            <FaUsers size={16} /> Users
          </div>
        </Link>

        <div style={{ marginTop: "auto" }}>
          <div onClick={handleLogout} style={{ ...menuStyle(false), cursor: "pointer" }}>
            <FaSignOutAlt size={16} /> Logout
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={mainContent} className="admin-container">
        <Outlet />
      </div>

    </div>
  );
}

const sidebarStyle = {
  width: "220px",
  background: "#ffffff",
  padding: "15px",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 0 10px rgba(0,0,0,0.05)",
  fontSize: "14px",
};

const mainContent = {
  flex: 1,
  background: "#f4f6f9",
  padding: "20px",
};

const linkStyle = {
  textDecoration: "none",
  color: "inherit",
};

const menuStyle = (active) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "10px",
  marginBottom: "8px",
  borderRadius: "8px",
  background: active ? "#e91e63" : "transparent",
  color: active ? "#fff" : "#333",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: active ? "600" : "400",
});

export default AdminLayout;