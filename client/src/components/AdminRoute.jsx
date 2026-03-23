import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { user } = useContext(AuthContext);

  // ✅ Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ✅ Logged in but NOT admin → go to shop
  if (!user.isAdmin) {
    return <Navigate to="/shop" />;
  }

  // ✅ Is admin → show admin page
  return children;
}

export default AdminRoute;