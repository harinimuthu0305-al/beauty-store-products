import React from "react";
import { Link } from "react-router-dom";

function HeroBanner() {
  return (
    <div
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1600&q=80)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Soft gradient overlay */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(to bottom right, rgba(231,84,128,0.6), rgba(255,154,184,0.6))",
        }}
      ></div>

      {/* Hero Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          color: "white",
          maxWidth: "700px",
          padding: "20px",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "800",
            letterSpacing: "2px",
            marginBottom: "20px",
            textShadow: "2px 2px 8px rgba(0,0,0,0.4)",
          }}
        >
          Glow With Natural Beauty
        </h1>

        <p
          style={{
            fontSize: "1.2rem",
            marginBottom: "30px",
            opacity: 0.9,
            lineHeight: "1.5",
            textShadow: "1px 1px 6px rgba(0,0,0,0.3)",
          }}
        >
          Discover premium skincare and makeup products designed to enhance
          your natural glow.
        </p>

        <Link
          to="/shop"
          style={{
            background: "#E75480",
            color: "white",
            padding: "14px 36px",
            borderRadius: "50px",
            textDecoration: "none",
            fontWeight: "700",
            fontSize: "16px",
            boxShadow: "0 6px 15px rgba(231,84,128,0.5)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-3px)";
            e.target.style.boxShadow = "0 10px 25px rgba(231,84,128,0.6)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 6px 15px rgba(231,84,128,0.5)";
          }}
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}

export default HeroBanner;