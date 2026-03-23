import React from "react";
import { Link } from "react-router-dom";

function SpecialOffer() {
  return (
    <section
      style={{
        padding: "70px 0",
        background: "#F7EFEA"
      }}
    >
      <div className="container">

        <div
          className="row align-items-center"
          style={{
            background: "linear-gradient(135deg,#fff,#ffe6ee)",
            borderRadius: "20px",
            padding: "50px",
            boxShadow: "0 15px 35px rgba(0,0,0,0.08)"
          }}
        >

          {/* Left Content */}
          <div className="col-md-6">

            <h2
              style={{
                fontWeight: "700",
                marginBottom: "15px"
              }}
            >
              Special Skincare Offer
            </h2>

            <p
              style={{
                fontSize: "18px",
                color: "#555",
                marginBottom: "25px"
              }}
            >
              Get <b style={{ color: "#E75480" }}>30% OFF</b> on premium
              skincare products. Limited time offer for glowing skin.
            </p>

            <Link to="/shop">

              <button
                style={{
                  background: "#f153af",
                  border: "none",
                  color: "white",
                  padding: "12px 30px",
                  borderRadius: "30px",
                  fontWeight: "600",
                  transition: "0.3s"
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "#d63b6e")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "#E75480")
                }
              >
                Shop Now
              </button>

            </Link>

          </div>

          {/* Right Image */}
          <div className="col-md-6 text-center">

            <img
              src="data:image/jpeg;base64,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"
              alt="Skincare Products"
              style={{
                width: "90%",
                maxHeight: "320px",
                objectFit: "contain"
              }}
            />

          </div>

        </div>

      </div>
    </section>
  );
}

export default SpecialOffer;



