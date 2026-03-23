import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

function CartPage() {

  const { cart, increaseQty, decreaseQty, removeFromCart } =
    useContext(CartContext);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="container mt-5">

      <h2 className="mb-4">Your Cart</h2>

      {cart.length === 0 ? (

        <div className="text-center">
          <h5>Your cart is empty</h5>

          <Link to="/shop" className="btn btn-dark mt-3">
            Continue Shopping
          </Link>
        </div>

      ) : (

        <div>

          {cart.map((item) => (

            <div key={item.id} className="card mb-3 p-3 shadow-sm">

              <div className="row align-items-center">

                {/* Product Image */}
                <div className="col-md-2 text-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="img-fluid"
                    style={{ height: "80px", objectFit: "contain" }}
                  />
                </div>

                {/* Product Title */}
                <div className="col-md-4">
                  <h6>{item.title}</h6>
                </div>

                {/* Price */}
                <div className="col-md-2">
                  ₹{item.price}
                </div>

                {/* Quantity Controls */}
                <div className="col-md-2 d-flex align-items-center">

                  <button
                    className="btn btn-sm btn-secondary me-2"
                    onClick={() => decreaseQty(item.id)}
                  >
                    -
                  </button>

                  {item.quantity}

                  <button
                    className="btn btn-sm btn-secondary ms-2"
                    onClick={() => increaseQty(item.id)}
                  >
                    +
                  </button>

                </div>

                {/* Remove Button */}
                <div className="col-md-2">

                  <button
                    className="btn btn-danger"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>

                </div>

              </div>

            </div>

          ))}

          {/* Total Price */}
          <h4 className="mt-3">
            Total: ₹{totalPrice.toFixed(2)}
          </h4>

          {/* Checkout Button */}
          <Link to="/checkout" className="btn btn-success mt-3">
            Proceed to Checkout
          </Link>

        </div>

      )}

    </div>
  );
}

export default CartPage;