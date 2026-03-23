import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import API from "../api/axios";

function CheckoutPage() {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState("method");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, email, phone, address } = formData;
    if (!name || !email || !phone || !address) {
      toast.error("Please fill all fields");
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Enter a valid email");
      return false;
    }
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
      toast.error("Enter a valid 10-digit phone number");
      return false;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return false;
    }
    return true;
  };

  const saveOrder = async (paymentMethod, paymentStatus) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.token;

      await API.post(
        "/orders",
        {
          items: cart.map((item) => ({
            productId: item.id || item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          shippingAddress: formData,
          totalPrice,
          paymentMethod,
          paymentStatus,
          status: paymentMethod === "COD" ? "Pending" : "Processing",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      clearCart();
      setFormData({ name: "", email: "", phone: "", address: "" });
    } catch (error) {
      console.error("Save order error:", error);
    }
  };

  const handleCODOrder = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await saveOrder("COD", "Pending");
      toast.success(`✅ Order placed! Pay ₹${totalPrice.toFixed(2)} on delivery.`);
    } catch (error) {
      toast.error("Failed to place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOnlinePayment = () => {
    if (!validateForm()) return;
    setShowPaymentModal(true);
    setPaymentStep("method");
    setSelectedMethod("");
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    if (method === "card") setPaymentStep("card");
    if (method === "upi") setPaymentStep("upi");
    if (method === "netbanking") processPayment();
    if (method === "wallet") processPayment();
  };

  const processPayment = async () => {
    setPaymentStep("processing");
    setLoading(true);
    setTimeout(async () => {
      try {
        await saveOrder("Online", "Paid");
        setPaymentStep("success");
      } catch (error) {
        toast.error("Order save failed!");
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  const handleCardSubmit = () => {
    if (!cardData.cardNumber || !cardData.cardName || !cardData.expiry || !cardData.cvv) {
      toast.error("Please fill all card details");
      return;
    }
    processPayment();
  };

  const handleUpiSubmit = () => {
    if (!upiId || !upiId.includes("@")) {
      toast.error("Enter valid UPI ID (e.g. name@upi)");
      return;
    }
    processPayment();
  };

  const closeModal = () => {
    if (paymentStep === "success") {
      toast.success("🎉 Payment successful! Order placed.");
    } else {
      toast.warning("Payment cancelled.");
    }
    setShowPaymentModal(false);
    setPaymentStep("method");
    setSelectedMethod("");
    setCardData({ cardNumber: "", cardName: "", expiry: "", cvv: "" });
    setUpiId("");
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(\d{4})/g, "$1 ")
      .trim();
  };

  return (
    <div className="container my-5">
      <h2 className="text-center fw-bold mb-4" style={{ color: "#e83e8c" }}>
        🛒 Checkout
      </h2>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <form className="p-4 shadow-sm rounded-4 bg-light">

            <div className="mb-3">
              <label className="form-label fw-semibold">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control rounded-pill shadow-sm"
                placeholder="Enter your full name"
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

            <div className="mb-3">
              <label className="form-label fw-semibold">Shipping Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-control rounded-4 shadow-sm"
                rows="3"
                placeholder="Enter your address"
              ></textarea>
            </div>

            {/* Order Summary */}
            {cart.length > 0 && (
              <div className="mb-3 p-3 bg-white rounded-3 shadow-sm">
                <h6 className="fw-bold mb-2">🧾 Order Summary</h6>
                {cart.map((item, index) => (
                  <div key={index} className="d-flex justify-content-between small mb-1">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <hr className="my-2" />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total</span>
                  <span style={{ color: "#e83e8c" }}>₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}

            <h5 className="mb-3 fw-bold">
              Total: <span style={{ color: "#e83e8c" }}>₹{totalPrice.toFixed(2)}</span>
            </h5>

            <div className="d-grid gap-3">
              <button
                type="button"
                onClick={handleCODOrder}
                disabled={loading}
                className="btn fw-bold"
                style={{
                  background: "linear-gradient(90deg,#e83e8c,#ff7bac)",
                  color: "#fff",
                  borderRadius: "50px",
                  padding: "12px 0",
                  fontSize: "1rem",
                }}
              >
                {loading ? "Placing Order..." : "💵 Cash on Delivery"}
              </button>

              <button
                type="button"
                onClick={handleOnlinePayment}
                disabled={loading}
                className="btn fw-bold"
                style={{
                  background: "linear-gradient(90deg,#072654,#1a56db)",
                  color: "#fff",
                  borderRadius: "50px",
                  padding: "12px 0",
                  fontSize: "1rem",
                }}
              >
                💳 Pay Online
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "420px",
              background: "#fff",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                background: "linear-gradient(135deg,#072654,#1a56db)",
                padding: "20px",
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "12px", opacity: 0.8 }}>
                  GlowAura Beauty Store
                </div>
                <div style={{ fontSize: "22px", fontWeight: "bold" }}>
                  ₹{totalPrice.toFixed(2)}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "13px", opacity: 0.8 }}>
                  🔒 Secure Payment
                </span>
                {paymentStep !== "processing" && paymentStep !== "success" && (
                  <button
                    onClick={closeModal}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#fff",
                      fontSize: "20px",
                      cursor: "pointer",
                      marginLeft: "10px",
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px" }}>

              {/* Step 1: Select Method */}
              {paymentStep === "method" && (
                <div>
                  <h6 className="fw-bold mb-3">Select Payment Method</h6>

                  {[
                    { id: "upi", icon: "📱", title: "UPI", sub: "GPay, PhonePe, Paytm" },
                    { id: "card", icon: "💳", title: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay" },
                    { id: "netbanking", icon: "🏦", title: "Net Banking", sub: "All major banks supported" },
                    { id: "wallet", icon: "👛", title: "Wallets", sub: "Paytm, Amazon Pay, Mobikwik" },
                  ].map((method) => (
                    <div
                      key={method.id}
                      onClick={() => handleMethodSelect(method.id)}
                      style={{
                        border: "1px solid #e0e0e0",
                        borderRadius: "10px",
                        padding: "14px",
                        marginBottom: "10px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor = "#1a56db")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor = "#e0e0e0")
                      }
                    >
                      <span style={{ fontSize: "24px" }}>{method.icon}</span>
                      <div>
                        <div className="fw-semibold">{method.title}</div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {method.sub}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 2: UPI */}
              {paymentStep === "upi" && (
                <div>
                  <button
                    onClick={() => setPaymentStep("method")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#1a56db",
                      cursor: "pointer",
                      marginBottom: "15px",
                      padding: 0,
                    }}
                  >
                    ← Back
                  </button>
                  <h6 className="fw-bold mb-3">📱 Pay with UPI</h6>
                  <input
                    type="text"
                    placeholder="Enter UPI ID (e.g. name@upi)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="form-control mb-3"
                    style={{ borderRadius: "10px", padding: "12px" }}
                  />
                  <div style={{ fontSize: "12px", color: "#666", marginBottom: "15px" }}>
                    💡 Demo: Enter any UPI format like test@upi
                  </div>
                  <button
                    onClick={handleUpiSubmit}
                    className="btn w-100 fw-bold"
                    style={{
                      background: "linear-gradient(90deg,#072654,#1a56db)",
                      color: "#fff",
                      borderRadius: "10px",
                      padding: "12px",
                    }}
                  >
                    Pay ₹{totalPrice.toFixed(2)}
                  </button>
                </div>
              )}

              {/* Step 3: Card */}
              {paymentStep === "card" && (
                <div>
                  <button
                    onClick={() => setPaymentStep("method")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#1a56db",
                      cursor: "pointer",
                      marginBottom: "15px",
                      padding: 0,
                    }}
                  >
                    ← Back
                  </button>
                  <h6 className="fw-bold mb-3">💳 Card Payment</h6>
                  <input
                    type="text"
                    placeholder="Card Number (4111 1111 1111 1111)"
                    value={cardData.cardNumber}
                    onChange={(e) =>
                      setCardData({
                        ...cardData,
                        cardNumber: formatCardNumber(e.target.value),
                      })
                    }
                    className="form-control mb-2"
                    style={{ borderRadius: "10px", padding: "12px" }}
                  />
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    value={cardData.cardName}
                    onChange={(e) =>
                      setCardData({ ...cardData, cardName: e.target.value })
                    }
                    className="form-control mb-2"
                    style={{ borderRadius: "10px", padding: "12px" }}
                  />
                  <div className="d-flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardData.expiry}
                      onChange={(e) =>
                        setCardData({ ...cardData, expiry: e.target.value })
                      }
                      className="form-control"
                      style={{ borderRadius: "10px", padding: "12px" }}
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      value={cardData.cvv}
                      onChange={(e) =>
                        setCardData({ ...cardData, cvv: e.target.value.slice(0, 3) })
                      }
                      className="form-control"
                      style={{ borderRadius: "10px", padding: "12px" }}
                    />
                  </div>
                  <div style={{ fontSize: "12px", color: "#666", marginBottom: "15px" }}>
                    💡 Demo: 4111 1111 1111 1111 | 12/26 | 123
                  </div>
                  <button
                    onClick={handleCardSubmit}
                    className="btn w-100 fw-bold"
                    style={{
                      background: "linear-gradient(90deg,#072654,#1a56db)",
                      color: "#fff",
                      borderRadius: "10px",
                      padding: "12px",
                    }}
                  >
                    Pay ₹{totalPrice.toFixed(2)}
                  </button>
                </div>
              )}

              {/* Step 4: Processing */}
              {paymentStep === "processing" && (
                <div className="text-center py-4">
                  <div
                    className="spinner-border mb-3"
                    style={{ color: "#1a56db", width: "50px", height: "50px" }}
                  ></div>
                  <h6 className="fw-bold">Processing Payment...</h6>
                  <p style={{ color: "#666", fontSize: "14px" }}>
                    Please wait. Do not close this window.
                  </p>
                  <p style={{ color: "#666", fontSize: "14px" }}>
                    Amount: ₹{totalPrice.toFixed(2)}
                  </p>
                </div>
              )}

              {/* Step 5: Success */}
              {paymentStep === "success" && (
                <div className="text-center py-3">
                  <div
                    style={{
                      width: "70px",
                      height: "70px",
                      background: "#e8f5e9",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 15px",
                      fontSize: "35px",
                    }}
                  >
                    ✅
                  </div>
                  <h5 className="fw-bold text-success">Payment Successful!</h5>
                  <p style={{ color: "#666", fontSize: "14px" }}>
                    ₹{totalPrice.toFixed(2)} paid successfully
                  </p>
                  <p style={{ color: "#666", fontSize: "14px" }}>
                    Your order has been placed! 🎉
                  </p>
                  <div
                    style={{
                      background: "#f5f5f5",
                      borderRadius: "10px",
                      padding: "12px",
                      marginBottom: "15px",
                      textAlign: "left",
                      fontSize: "13px",
                    }}
                  >
                    <div>
                      <strong>Order ID:</strong> ORD{Date.now().toString().slice(-6)}
                    </div>
                    <div>
                      <strong>Amount:</strong> ₹{totalPrice.toFixed(2)}
                    </div>
                    <div>
                      <strong>Status:</strong>{" "}
                      <span className="text-success fw-bold">Paid ✅</span>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="btn w-100 fw-bold"
                    style={{
                      background: "linear-gradient(90deg,#e83e8c,#ff7bac)",
                      color: "#fff",
                      borderRadius: "10px",
                      padding: "12px",
                    }}
                  >
                    Continue Shopping 🛍️
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {paymentStep !== "processing" && paymentStep !== "success" && (
              <div
                style={{
                  borderTop: "1px solid #eee",
                  padding: "12px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontSize: "12px",
                  color: "#999",
                }}
              >
                🔒 Secured by Razorpay | 256-bit SSL Encryption
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;