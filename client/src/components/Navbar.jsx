import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-light bg-white shadow-sm">
      <div className="container d-flex flex-column">

        {/* First Row: Logo + Search + Auth */}
        <div className="d-flex align-items-center justify-content-between py-2 w-100">

          {/* Logo */}
          <Link className="navbar-brand fw-bold fs-4" to="/" style={{ color: "#e83e8c" }}>
            GlowAura
          </Link>

          {/* Search Bar */}
          <form className="flex-grow-1 mx-3">
            <input
              type="search"
              className="form-control rounded-pill shadow-sm"
              placeholder="Search products..."
            />
          </form>

          {/* Auth Buttons */}
          {!user ? (
            <div className="d-flex gap-2">
              <Link className="btn btn-outline-dark rounded-pill px-3" to="/login">
                👤 Login
              </Link>
              <Link
                className="btn text-white rounded-pill px-3"
                style={{ background: "linear-gradient(90deg,#e83e8c,#ff7bac)" }}
                to="/signup"
              >
                ✍️ Signup
              </Link>
            </div>
          ) : (
            <div className="d-flex gap-2 align-items-center">
              <span className="fw-semibold" style={{ color: "#e83e8c", fontSize: "14px" }}>
                👋 {user.name || "User"}
              </span>
              <button
                className="btn btn-outline-danger rounded-pill px-3"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <hr className="my-2" />

        {/* Second Row: Navigation Menu */}
        <div className="d-flex justify-content-center gap-4 py-2 w-100 flex-wrap">
          <Link className="nav-link text-dark fw-semibold" to="/">Home</Link>
          <Link className="nav-link text-dark fw-semibold" to="/shop">Shop</Link>
          <Link className="nav-link text-dark fw-semibold" to="/offers">Offers</Link>
          <Link className="nav-link text-dark fw-semibold" to="/wishlist">💖 Wishlist</Link>

          {/* ✅ My Orders - only for logged in users */}
          {user && (
            <Link className="nav-link text-dark fw-semibold" to="/my-orders">
              📦 My Orders
            </Link>
          )}

          {/* ✅ Cart with badge */}
          <Link className="nav-link text-dark fw-semibold position-relative" to="/cart">
            🛒 Cart
            {cart && cart.length > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                style={{ background: "#e83e8c", fontSize: "10px" }}
              >
                {cart.length}
              </span>
            )}
          </Link>

          {/* ❌ NO admin link here - admin logs in separately */}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;