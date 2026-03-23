import React from "react";

function AnnouncementBar() {
  return (
    <div
      style={{
        background: "linear-gradient(90deg, #E75480, #FF9AB8)",
        color: "white",
        fontWeight: "500",
        fontSize: "14px",
        letterSpacing: "0.5px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        zIndex: "9999",
        marginBottom: "25px", // <-- space below bar
      }}
      className="py-2"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "25px",
          flexWrap: "wrap",
        }}
      >
        <span>🚚 Free Shipping on orders above ₹999</span>
        <span style={{ opacity: 0.7 }}>|</span>
        <span>💄 20% OFF on Skincare Products</span>
        <span style={{ opacity: 0.7 }}>|</span>
        <span>🎁 New Arrivals Just Dropped!</span>
      </div>
    </div>
  );
}

export default AnnouncementBar;