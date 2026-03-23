import React, { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH ORDERS with auth token
  const fetchOrders = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.token;

      const res = await fetch("http://localhost:4000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ UPDATE STATUS with auth token
  const handleStatusChange = async (id, status) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.token;

      await fetch(`http://localhost:4000/api/orders/${id}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      fetchOrders();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // 🎨 STATUS STYLE
  const getStatusStyle = (status) => {
    if (status === "Pending") return "badge bg-warning text-dark";
    if (status === "Processing") return "badge bg-info text-dark";
    if (status === "Shipped") return "badge bg-primary";
    if (status === "Delivered") return "badge bg-success";
    if (status === "Cancelled") return "badge bg-danger";
    return "badge bg-secondary";
  };

  // 🎨 PAYMENT STATUS STYLE
  const getPaymentStyle = (status) => {
    if (status === "Paid") return "badge bg-success";
    if (status === "Pending") return "badge bg-warning text-dark";
    if (status === "Failed") return "badge bg-danger";
    return "badge bg-secondary";
  };

  if (loading) {
    return (
      <div className="p-3 text-center">
        <div className="spinner-border" role="status"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-3">
      <h3 className="mb-3">
        Orders{" "}
        <span className="badge bg-secondary">{orders.length}</span>
      </h3>

      <div className="table-responsive">
        <table className="table table-bordered bg-white">
          <thead className="table-light">
            <tr>
              <th>S.No</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Products</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((o, index) => (
                <tr key={o._id}>
                  {/* S.No */}
                  <td>{index + 1}</td>

                  {/* Customer */}
                  <td>
                    <div>{o.shippingAddress?.name || "N/A"}</div>
                    <small className="text-muted">
                      {o.shippingAddress?.email || ""}
                    </small>
                  </td>

                  {/* Phone */}
                  <td>{o.shippingAddress?.phone || "N/A"}</td>

                  {/* Address */}
                  <td style={{ maxWidth: "150px", fontSize: "13px" }}>
                    {o.shippingAddress?.address || "N/A"}
                  </td>

                  {/* Products */}
                  <td style={{ maxWidth: "180px" }}>
                    {o.items && o.items.length > 0 ? (
                      o.items.map((item, i) => (
                        <div
                          key={i}
                          style={{ fontSize: "13px" }}
                          className="d-flex align-items-center gap-1 mb-1"
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{
                                width: "30px",
                                height: "30px",
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                            />
                          )}
                          <span>
                            {item.name} × {item.quantity}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="text-muted">No items</span>
                    )}
                  </td>

                  {/* Total */}
                  <td className="fw-bold">₹{o.totalPrice?.toFixed(2)}</td>

                  {/* Payment */}
                  <td>
                    <div>
                      <span className="badge bg-light text-dark border mb-1">
                        {o.paymentMethod || "COD"}
                      </span>
                    </div>
                    <span className={getPaymentStyle(o.paymentStatus)}>
                      {o.paymentStatus || "Pending"}
                    </span>
                  </td>

                  {/* Date */}
                  <td style={{ fontSize: "13px" }}>
                    {o.createdAt
                      ? new Date(o.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </td>

                  {/* Status Badge */}
                  <td>
                    <span className={getStatusStyle(o.status)}>
                      {o.status || "Pending"}
                    </span>
                  </td>

                  {/* Update Status */}
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={o.status}
                      onChange={(e) =>
                        handleStatusChange(o._id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-4">
                  <div style={{ fontSize: "40px" }}>📦</div>
                  <p className="text-muted mb-0">No orders found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;