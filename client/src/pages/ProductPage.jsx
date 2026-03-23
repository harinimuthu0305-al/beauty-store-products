import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";

function ProductPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hovered, setHovered] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct({ ...res.data, stock: res.data.countInStock });
      } catch {
        try {
          const res = await API.get("/live-products");
          const found = res.data.find((p) => String(p.id) === String(id));
          setProduct(found);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchProduct();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Reviews fetch error:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!comment.trim()) {
      setError("Please write a comment");
      return;
    }

    setSubmitting(true);
    try {
      const token = user?.token;
      await API.post(
        "/reviews",
        { productId: id, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Review submitted successfully!");
      setComment("");
      setRating(5);
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  const renderStars = (value, size = 20) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span key={star} style={{ fontSize: size, color: star <= value ? "#ffaa00" : "#ddd" }}>
        ★
      </span>
    ));
  };

  if (!product) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-danger" role="status" />
        <p className="mt-2">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">

      {/* PRODUCT DETAILS */}
      <div className="row shadow-lg p-4 rounded bg-white mb-5">

        {/* IMAGE */}
        <div className="col-md-6 text-center">
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid"
            style={{ maxHeight: "400px", objectFit: "contain" }}
          />
        </div>

        {/* DETAILS */}
        <div className="col-md-6">
          <span className="badge bg-dark mb-2">{product.category}</span>
          <h2 className="mb-2">{product.name}</h2>
          <p className="text-muted mb-1">Brand: {product.brand}</p>

          {/* AVERAGE RATING */}
          <div className="d-flex align-items-center mb-2" style={{ gap: "8px" }}>
            <span>{renderStars(Math.round(avgRating))}</span>
            <span style={{ fontWeight: "600", fontSize: "15px" }}>{avgRating}</span>
            <span style={{ color: "#888", fontSize: "13px" }}>
              ({reviews.length} reviews)
            </span>
          </div>

          <h3 className="text-danger mb-2">₹{product.price}</h3>

          {product.discount > 0 && (
            <span className="badge bg-success mb-2">{product.discount}% OFF</span>
          )}

          <p style={{ lineHeight: "1.7" }}>{product.description}</p>

          <p>
            {product.stock > 0 || product.countInStock > 0 ? (
              <span style={{ color: "green", fontWeight: "500" }}>✓ In Stock</span>
            ) : (
              <span style={{ color: "red", fontWeight: "500" }}>✗ Out of Stock</span>
            )}
          </p>

          <div className="mt-4">
            <button
              className="btn btn-dark me-3 px-4"
              disabled={product.stock === 0 && product.countInStock === 0}
              onClick={() => alert("Added to cart")}
            >
              Add to Cart
            </button>
            <button
              className="btn btn-danger px-4"
              disabled={product.stock === 0 && product.countInStock === 0}
              onClick={() => alert("Proceed to buy")}
            >
              Buy Now
            </button>
          </div>

          <div className="mt-3">
            <Link to="/shop" className="btn btn-outline-secondary">
              ← Back to Shop
            </Link>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="row">

        {/* REVIEWS LIST */}
        <div className="col-md-8">
          <h4 className="mb-4 fw-bold">
            Customer Reviews
            {reviews.length > 0 && (
              <span style={{ fontSize: "15px", fontWeight: "400", color: "#888", marginLeft: "10px" }}>
                {reviews.length} review{reviews.length > 1 ? "s" : ""}
              </span>
            )}
          </h4>

          {reviews.length === 0 ? (
            <div style={{ padding: "20px", background: "#f9fafb", borderRadius: "10px", color: "#888", textAlign: "center" }}>
              No reviews yet. Be the first to review!
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                style={{
                  background: "#fff", border: "1px solid #e5e7eb",
                  borderRadius: "10px", padding: "16px", marginBottom: "12px"
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div className="d-flex align-items-center" style={{ gap: "8px" }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "50%",
                      background: "#e91e63", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: "600", fontSize: "14px"
                    }}>
                      {review.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: "600", fontSize: "14px" }}>
                        {review.user?.name || "User"}
                      </p>
                      <span style={{ fontSize: "12px", color: "#888" }}>
                        {new Date(review.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </span>
                    </div>
                  </div>
                  <div>{renderStars(review.rating, 16)}</div>
                </div>
                <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#444", lineHeight: "1.6" }}>
                  {review.comment}
                </p>
              </div>
            ))
          )}
        </div>

        {/* WRITE REVIEW FORM */}
        <div className="col-md-4">
          <div style={{
            background: "#fff", border: "1px solid #e5e7eb",
            borderRadius: "12px", padding: "20px"
          }}>
            <h5 className="fw-bold mb-3">Write a Review</h5>

            {!user ? (
              <div style={{ textAlign: "center", color: "#888" }}>
                <p>Please login to write a review</p>
                <Link to="/login" className="btn btn-danger btn-sm px-4">Login</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview}>

                {error && (
                  <div style={{ background: "#fee2e2", color: "#991b1b", padding: "8px 12px", borderRadius: "6px", marginBottom: "10px", fontSize: "13px" }}>
                    {error}
                  </div>
                )}
                {success && (
                  <div style={{ background: "#dcfce7", color: "#166534", padding: "8px 12px", borderRadius: "6px", marginBottom: "10px", fontSize: "13px" }}>
                    {success}
                  </div>
                )}

                {/* STAR SELECTOR */}
                <div className="mb-3">
                  <label style={{ fontSize: "14px", fontWeight: "500", display: "block", marginBottom: "6px" }}>
                    Your Rating
                  </label>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        style={{
                          fontSize: "28px", cursor: "pointer",
                          color: star <= (hovered || rating) ? "#ffaa00" : "#ddd",
                          transition: "color 0.1s"
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <small style={{ color: "#888" }}>
                    {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][hovered || rating]}
                  </small>
                </div>

                {/* COMMENT */}
                <div className="mb-3">
                  <label style={{ fontSize: "14px", fontWeight: "500", display: "block", marginBottom: "6px" }}>
                    Your Comment
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Share your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{
                      width: "100%", padding: "8px 12px",
                      border: "1px solid #d1d5db", borderRadius: "8px",
                      fontSize: "14px", resize: "none", outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: "100%", padding: "10px",
                    background: submitting ? "#ccc" : "#e91e63",
                    color: "#fff", border: "none",
                    borderRadius: "8px", fontWeight: "600",
                    fontSize: "14px", cursor: submitting ? "not-allowed" : "pointer"
                  }}
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;