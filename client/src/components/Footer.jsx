import React from "react";
import { Link, useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();
  if (location.pathname === "/shop") return null;

  return (
    <footer style={{ background: "#FFF6F8", padding: "60px 0 20px 0", marginTop: "60px" }}>
      <div className="container">

        <div className="row g-4">

          {/* Brand Info */}
          <div className="col-md-3">
            <h4 style={{ color: "#E75480", fontWeight: "700" }}>Glamiza Beauty</h4>
            <p style={{ color: "#555" }}>Your one stop shop for skincare, makeup, haircare and premium beauty essentials.</p>
          </div>

          {/* Quick Links */}
          <div className="col-md-3">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-dark text-decoration-none hover-effect">Home</Link></li>
              <li><Link to="/shop" className="text-dark text-decoration-none hover-effect">Shop</Link></li>
              <li><Link to="/cart" className="text-dark text-decoration-none hover-effect">Cart</Link></li>
              <li><Link to="/wishlist" className="text-dark text-decoration-none hover-effect">Wishlist</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="col-md-3">
            <h5 className="mb-3">Customer Support</h5>
            <ul className="list-unstyled">
              <li className="hover-effect">Shipping Policy</li>
              <li className="hover-effect">Return Policy</li>
              <li className="hover-effect">Privacy Policy</li>
              <li className="hover-effect">Terms & Conditions</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-md-3">
            <h5 className="mb-3">Join Our Newsletter</h5>
            <p style={{ color: "#555" }}>Get beauty tips & exclusive offers</p>
            <div className="d-flex">
              <input type="email" placeholder="Enter your email" className="form-control me-2 rounded-pill border-2 shadow-sm"/>
              <button style={{
                background: "linear-gradient(90deg,#e83e8c,#ff7bac)",
                border: "none",
                color: "#fff",
                padding: "8px 20px",
                borderRadius: "50px",
                transition: "0.3s",
                cursor: "pointer"
              }}>Subscribe</button>
            </div>
          </div>

        </div>

        <hr className="mt-4"/>

        <div className="text-center">
          <p className="text-secondary mb-2">© 2026 Glamiza Beauty Store. All rights reserved.</p>
          <div style={{ fontSize: "22px" }}>
            <span style={{ margin: "10px", cursor: "pointer", transition:"0.3s" }} className="hover-effect">📘</span>
            <span style={{ margin: "10px", cursor: "pointer", transition:"0.3s" }} className="hover-effect">📸</span>
            <span style={{ margin: "10px", cursor: "pointer", transition:"0.3s" }} className="hover-effect">🐦</span>
            <span style={{ margin: "10px", cursor: "pointer", transition:"0.3s" }} className="hover-effect">▶️</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;