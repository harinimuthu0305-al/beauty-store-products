import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.token;

      const res = await API.get("/orders/myorders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(res.data);
    } catch (err) {
      console.error("Fetch my orders error:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auto refresh every 30 seconds
  useEffect(() => {
    fetchMyOrders();

    const interval = setInterval(() => {
      fetchMyOrders();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Calculate estimated delivery date (7 days from order date)
  const getEstimatedDelivery = (createdAt, status) => {
    if (status === "Delivered") return null;
    if (!createdAt) return "N/A";
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 7);
    return orderDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ✅ Get actual delivery date
  const getDeliveredDate = (updatedAt) => {
    if (!updatedAt) return "N/A";
    return new Date(updatedAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // 🎨 Status badge style
  const getStatusStyle = (status) => {
    if (status === "Delivered") return { background: "#28a745", color: "#fff" };
    if (status === "Shipped") return { background: "#007bff", color: "#fff" };
    if (status === "Processing") return { background: "#17a2b8", color: "#fff" };
    if (status === "Cancelled") return { background: "#dc3545", color: "#fff" };
    return { background: "#ffc107", color: "#212529" };
  };

  // ✅ Order tracking steps
  const getTrackingSteps = (status) => {
    const steps = ["Pending", "Processing", "Shipped", "Delivered"];
    const currentIndex = steps.indexOf(status);
    return steps.map((step, index) => ({
      label: step,
      done: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border" style={{ color: "#e83e8c" }}></div>
        <p className="mt-2">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="text-center fw-bold mb-4" style={{ color: "#e83e8c" }}>
        📦 My Orders
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: "60px" }}>📦</div>
          <h5 className="text-muted mt-3">No orders yet!</h5>
          <p className="text-muted">You haven't placed any orders yet.</p>
          <Link
            to="/shop"
            className="btn mt-2"
            style={{
              background: "linear-gradient(90deg,#e83e8c,#ff7bac)",
              color: "#fff",
              borderRadius: "50px",
              padding: "10px 30px",
            }}
          >
            Start Shopping 🛍️
          </Link>
        </div>
      ) : (
        orders.map((order, index) => (
          <div
            key={order._id}
            className="mb-4 shadow-sm rounded-4 overflow-hidden border"
          >
            {/* ✅ Order Header */}
            <div
              className="d-flex justify-content-between align-items-center px-4 py-3"
              style={{ background: "#fff5f9" }}
            >
              <div>
                <span className="fw-bold" style={{ color: "#e83e8c" }}>
                  Order #{index + 1}
                </span>
                <span className="text-muted ms-3" style={{ fontSize: "13px" }}>
                  Placed on:{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>
              <div className="d-flex gap-2 align-items-center">
                <span className="badge bg-light text-dark border">
                  {order.paymentMethod || "COD"}
                </span>
                <span
                  className="badge rounded-pill px-3 py-2"
                  style={getStatusStyle(order.status)}
                >
                  {order.status || "Pending"}
                </span>
              </div>
            </div>

            {/* ✅ Order Tracking Bar */}
            {order.status !== "Cancelled" && (
              <div className="px-4 py-3 bg-white border-bottom">
                <div className="d-flex justify-content-between align-items-center position-relative">
                  {/* Background Line */}
                  <div
                    style={{
                      position: "absolute",
                      top: "15px",
                      left: "10%",
                      right: "10%",
                      height: "3px",
                      background: "#e0e0e0",
                      zIndex: 0,
                    }}
                  />

                  {/* Filled Progress Line */}
                  <div
                    style={{
                      position: "absolute",
                      top: "15px",
                      left: "10%",
                      height: "3px",
                      background: "#e83e8c",
                      zIndex: 1,
                      width:
                        order.status === "Pending" ? "0%" :
                        order.status === "Processing" ? "33%" :
                        order.status === "Shipped" ? "66%" :
                        order.status === "Delivered" ? "100%" : "0%",
                      transition: "width 0.5s ease",
                    }}
                  />

                  {/* Steps */}
                  {getTrackingSteps(order.status).map((step, i) => (
                    <div
                      key={i}
                      className="text-center"
                      style={{ zIndex: 2, flex: 1 }}
                    >
                      <div
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          background: step.done ? "#e83e8c" : "#e0e0e0",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 6px",
                          fontSize: "14px",
                          fontWeight: "bold",
                          border: step.current ? "3px solid #ff7bac" : "none",
                        }}
                      >
                        {step.done ? "✓" : i + 1}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: step.current ? "bold" : "normal",
                          color: step.done ? "#e83e8c" : "#999",
                        }}
                      >
                        {step.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ✅ Delivery Date Info */}
            <div
              className="px-4 py-2 d-flex gap-4"
              style={{ background: "#fff9fb", fontSize: "13px" }}
            >
              {order.status === "Delivered" ? (
                <span className="text-success fw-semibold">
                  ✅ Delivered on: {getDeliveredDate(order.updatedAt)}
                </span>
              ) : order.status === "Cancelled" ? (
                <span className="text-danger fw-semibold">
                  ❌ Order Cancelled
                </span>
              ) : (
                <span style={{ color: "#e83e8c" }} className="fw-semibold">
                  🚚 Estimated Delivery:{" "}
                  {getEstimatedDelivery(order.createdAt, order.status)}
                </span>
              )}
            </div>

            {/* ✅ Order Items */}
            <div className="bg-white px-4 py-3">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, i) => (
                  <div
                    key={i}
                    className="d-flex align-items-center gap-3 mb-3"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          border: "1px solid #eee",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "60px",
                          height: "60px",
                          background: "#f5f5f5",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "24px",
                        }}
                      >
                        💄
                      </div>
                    )}

                    <div className="flex-grow-1">
                      <div className="fw-semibold">{item.name}</div>
                      <div className="text-muted" style={{ fontSize: "13px" }}>
                        Qty: {item.quantity} × ₹{item.price}
                      </div>
                    </div>

                    <div className="fw-bold" style={{ color: "#e83e8c" }}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">No items</p>
              )}
            </div>

            {/* ✅ Order Footer */}
            <div
              className="d-flex justify-content-between align-items-center px-4 py-3 border-top"
              style={{ background: "#fafafa" }}
            >
              <div style={{ fontSize: "13px", color: "#666" }}>
                📍 {order.shippingAddress?.address || "N/A"},{" "}
                {order.shippingAddress?.phone || ""}
              </div>
              <div className="fw-bold fs-5" style={{ color: "#e83e8c" }}>
                Total: ₹{order.totalPrice?.toFixed(2)}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyOrders;