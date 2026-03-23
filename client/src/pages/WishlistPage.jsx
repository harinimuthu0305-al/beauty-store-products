import React, { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";

function WishlistPage() {

  const { wishlist, removeFromWishlist } = useContext(WishlistContext);

  return (

    <div className="container mt-5">

      <h2>Your Wishlist</h2>

      <div className="row">

        {wishlist.map(item => (

          <div key={item.id} className="col-md-3 mt-3">

            <div className="card p-3">

              <img
                src={item.image}
                alt={item.name}
                height="150"
                style={{ objectFit: "contain" }}
              />

              <h6>{item.name}</h6>

              <p>₹{item.price}</p>

              <button
                className="btn btn-danger"
                onClick={() => removeFromWishlist(item.id)}
              >
                Remove
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default WishlistPage;