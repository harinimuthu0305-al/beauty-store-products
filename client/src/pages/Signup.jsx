import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";

function Signup() {
  const { login } = useContext(AuthContext); // ✅ use login not signup
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, phone } = formData;

    // ✅ Validation
    if (!name || !email || !password || !phone) {
      toast.error("All fields are required");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // ✅ Real backend API call
      const res = await API.post("/auth/register", { name, email, password });

      const userData = res.data;

      // ✅ Save user to localStorage
      login(userData);

      toast.success("Account created successfully! 🎉");

      // ✅ Redirect based on role
      if (userData.isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/shop");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center mb-4 fw-bold" style={{ color: "#e83e8c" }}>
        Create Account
      </h2>
      <div className="row justify-content-center">
        <div className="col-md-4">
          <form
            className="p-4 shadow-sm rounded-4 bg-light"
            onSubmit={handleSubmit}
          >
            <div className="mb-3">
              <label className="form-label fw-semibold">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control rounded-pill shadow-sm"
                placeholder="Enter your name"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control rounded-pill shadow-sm"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control rounded-pill shadow-sm"
                placeholder="Minimum 6 characters"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-control rounded-pill shadow-sm"
                placeholder="Enter 10-digit phone number"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn w-100 fw-bold"
              style={{
                background: loading
                  ? "#ccc"
                  : "linear-gradient(90deg,#e83e8c,#ff7bac)",
                color: "#fff",
                borderRadius: "50px",
                padding: "10px 0",
                fontSize: "1rem",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Creating Account..." : "Signup"}
            </button>

            <div className="text-center mt-3">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-decoration-none"
                style={{ color: "#e83e8c" }}
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;