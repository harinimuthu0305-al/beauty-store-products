import React, { useState } from "react";

function BestSellers() {

  const [cart, setCart] = useState([]);

  const bestProducts = [
    {
      id: 1,
      name: "Vitamin C Serum",
      price: 284,
      image: "https://images.unsplash.com/photo-1601049676869-702ea24cfd58"
    },
    {
      id: 2,
      name: "Sunscreen SPF50",
      price: 349,
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
    },
    {
      id: 3,
      name: "Hydrating Face Cream",
      price: 420,
      image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e"
    },
    {
      id: 4,
      name: "Lip Gloss",
      price: 199,
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa"
    }
  ];

  const addToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    alert(product.name + " added to cart!");
  };

  return (
    <div
      style={{
        background: "#F7EFEA",
        padding: "60px 20px",
        textAlign: "center"
      }}
    >

      <h2
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "40px"
        }}
      >
        Best Sellers
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "30px",
          maxWidth: "1100px",
          margin: "auto"
        }}
      >

        {bestProducts.map((product) => (
          <div
            key={product.id}
            style={{
              background: "white",
              borderRadius: "15px",
              overflow: "hidden",
              boxShadow: "0 10px 25px rgba(102, 89, 89, 0.08)"
            }}
          >

            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover"
              }}
            />

            <div style={{ padding: "18px" }}>

              <h4>{product.name}</h4>

              <p
                style={{
                  color: "#E75480",
                  fontWeight: "700"
                }}
              >
                ₹{product.price}
              </p>

              <button
                onClick={() => addToCart(product)}
                style={{
                  marginTop: "10px",
                  background: "#E75480",
                  border: "none",
                  color: "white",
                  padding: "8px 20px",
                  borderRadius: "25px",
                  cursor: "pointer"
                }}
              >
                Add to Cart
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default BestSellers;



