import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setLoading(true);

    try {
      // ✅ Real backend API call
      const res = await API.post("/auth/login", { email, password });

      const userData = res.data;

      // ✅ Save full user object including token to localStorage
      login(userData);

      toast.success("Login successful!");

      // ✅ Redirect based on role
      if (userData.isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/shop");
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center mb-4 fw-bold" style={{ color: "#e83e8c" }}>
        Login
      </h2>
      <div className="row justify-content-center">
        <div className="col-md-4">
          <form className="p-4 shadow-sm rounded-4 bg-light" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control rounded-pill shadow-sm"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control rounded-pill shadow-sm"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn w-100 fw-bold"
              style={{
                background: loading ? "#ccc" : "linear-gradient(90deg,#e83e8c,#ff7bac)",
                color: "#fff",
                borderRadius: "50px",
                padding: "10px 0",
                fontSize: "1rem",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <div className="text-center mt-3">
              <Link to="/signup" style={{ color: "#e83e8c" }}>
                Don't have an account? Signup
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;