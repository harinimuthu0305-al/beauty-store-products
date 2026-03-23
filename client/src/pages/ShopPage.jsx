import React, { useEffect, useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";

function ShopPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalProduct, setModalProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hovered, setHovered] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  // ✅ NEW — Search & Filter states
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);

  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    API.get("/live-products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const fetchReviews = async (productId) => {
    try {
      const res = await API.get(`/reviews/${productId}`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const categories = [
    "All","Lipstick","Nail Polish","Skincare","Haircare",
    "Perfume","Eye Makeup","Face Makeup","Face Wash","Serum","Cream"
  ];

  // ✅ NEW — Search + Category + Price + Rating filter
  const filteredProducts = products
    .filter((p) => selectedCategory === "All" ||
      p.category?.toLowerCase() === selectedCategory.toLowerCase())
    .filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => minPrice === "" || p.price >= Number(minPrice))
    .filter((p) => maxPrice === "" || p.price <= Number(maxPrice))
    .filter((p) => p.rating >= minRating)
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const openModal = (product) => {
    setModalProduct(product);
    setReviews([]);
    setComment("");
    setRating(5);
    setReviewError("");
    setReviewSuccess("");
    fetchReviews(product.id);
  };

  const closeModal = () => {
    setModalProduct(null);
    setReviews([]);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
    navigate("/cart");
  };

  const handleAddToWishlist = (product) => {
    addToWishlist(product);
    toast.success(`${product.name} added to wishlist!`);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");
    if (!comment.trim()) {
      setReviewError("Please write a comment");
      return;
    }
    setSubmitting(true);
    try {
      const token = user?.token;
      await API.post(
        "/reviews",
        { productId: modalProduct.id, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviewSuccess("Review submitted!");
      setComment("");
      setRating(5);
      fetchReviews(modalProduct.id);
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  const renderStars = (value, size = 16) =>
    [1, 2, 3, 4, 5].map((star) => (
      <span key={star} style={{ fontSize: size, color: star <= value ? "#ffaa00" : "#ddd" }}>★</span>
    ));

  // ✅ Reset all filters
  const resetFilters = () => {
    setSearch("");
    setSortBy("default");
    setMinPrice("");
    setMaxPrice("");
    setMinRating(0);
    setSelectedCategory("All");
  };

  return (
    <div style={{ display: "flex", padding: "20px", gap: "20px", background: "#f4f6f9" }}>

      {/* SIDEBAR */}
      <div style={{ width: "250px", background: "#fff", padding: "15px", borderRadius: "10px", height: "fit-content" }}>
        <h4>Categories</h4>
        {categories.map((c, i) => (
          <div
            key={i}
            onClick={() => setSelectedCategory(c)}
            style={{
              padding: "8px", marginBottom: "6px", cursor: "pointer",
              borderRadius: "5px",
              background: selectedCategory === c ? "#ff4d6d" : "#fff",
              color: selectedCategory === c ? "#fff" : "#000",
            }}
          >
            {c}
          </div>
        ))}

        {/* ✅ PRICE FILTER */}
        <hr style={{ margin: "12px 0" }} />
        <h6 style={{ fontWeight: "600", marginBottom: "8px" }}>Price Range (₹)</h6>
        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{ width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "13px", marginBottom: "6px", boxSizing: "border-box" }}
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ width: "100%", padding: "6px 8px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "13px", marginBottom: "6px", boxSizing: "border-box" }}
        />

        {/* ✅ RATING FILTER */}
        <hr style={{ margin: "12px 0" }} />
        <h6 style={{ fontWeight: "600", marginBottom: "8px" }}>Min Rating</h6>
        {[0, 1, 2, 3, 4].map((r) => (
          <div
            key={r}
            onClick={() => setMinRating(r)}
            style={{
              padding: "6px 8px", marginBottom: "4px", cursor: "pointer",
              borderRadius: "5px", fontSize: "13px",
              background: minRating === r ? "#ff4d6d" : "#fff",
              color: minRating === r ? "#fff" : "#000",
            }}
          >
            {r === 0 ? "All Ratings" : `${r}★ & above`}
          </div>
        ))}

        {/* ✅ RESET */}
        <hr style={{ margin: "12px 0" }} />
        <button
          onClick={resetFilters}
          style={{ width: "100%", padding: "8px", background: "#f3f4f6", border: "1px solid #ddd", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "500" }}
        >
          Reset Filters
        </button>
      </div>

      {/* PRODUCTS */}
      <div style={{ flex: 1 }}>

        {/* ✅ SEARCH + SORT BAR */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none" }}
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: "10px 14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none", cursor: "pointer" }}
          >
            <option value="default">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        {/* RESULT COUNT */}
        <div style={{ marginBottom: "12px", color: "#888", fontSize: "13px" }}>
          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
          {search && ` for "${search}"`}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <div key={p.id} style={{ background: "#fff", borderRadius: "10px", overflow: "hidden", position: "relative", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                {p.discount > 0 && (
                  <span style={{ position: "absolute", top: "10px", left: "10px", background: "green", color: "#fff", padding: "3px 6px", fontSize: "12px", borderRadius: "4px" }}>
                    {p.discount}% OFF
                  </span>
                )}
                <div
                  onClick={() => openModal(p)}
                  style={{ width: "100%", height: "200px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backgroundColor: "#f9f9f9" }}
                >
                  <img src={p.image} alt={p.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                </div>
                <div style={{ padding: "10px" }}>
                  <h4 style={{ fontSize: "14px" }}>{p.name}</h4>
                  <p style={{ color: "#ffaa00" }}>⭐ {p.rating}</p>
                  <p style={{ color: "#ff4d6d", fontWeight: "bold" }}>₹{p.price}</p>
                  <button
                    onClick={() => handleAddToCart(p)}
                    style={{ background: "#ff4d6d", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "5px", cursor: "pointer" }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px", color: "#888" }}>
              <p style={{ fontSize: "18px", marginBottom: "8px" }}>No products found</p>
              <p style={{ fontSize: "13px" }}>Try changing your search or filters</p>
              <button
                onClick={resetFilters}
                style={{ marginTop: "10px", padding: "8px 20px", background: "#ff4d6d", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL — unchanged */}
      {modalProduct && (
        <div onClick={closeModal} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", padding: "20px", borderRadius: "12px", width: "420px", maxHeight: "90vh", overflowY: "auto", textAlign: "center", position: "relative" }}>
            <button onClick={closeModal} style={{ position: "absolute", top: "10px", right: "10px", cursor: "pointer", background: "#ff4d6d", color: "#fff", border: "none", borderRadius: "50%", width: "25px", height: "25px" }}>X</button>
            <img src={modalProduct.image} alt={modalProduct.name} style={{ width: "100%", height: "180px", objectFit: "contain", marginBottom: "10px" }} />
            <h3 style={{ marginBottom: "4px" }}>{modalProduct.name}</h3>
            <p style={{ color: "#888", fontSize: "13px", margin: "0 0 4px" }}>{modalProduct.brand}</p>
            {avgRating && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginBottom: "6px" }}>
                <span>{renderStars(Math.round(avgRating))}</span>
                <span style={{ fontWeight: "600" }}>{avgRating}</span>
                <span style={{ color: "#888", fontSize: "12px" }}>({reviews.length})</span>
              </div>
            )}
            <p style={{ color: "#ff4d6d", fontWeight: "bold", fontSize: "18px", margin: "6px 0" }}>₹{modalProduct.price}</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "16px" }}>
              <button onClick={() => handleAddToCart(modalProduct)} style={{ background: "#ff4d6d", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "5px", cursor: "pointer" }}>Add to Cart</button>
              <button onClick={() => handleAddToWishlist(modalProduct)} style={{ background: "#ff4d6d", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "5px", cursor: "pointer" }}>Wishlist</button>
            </div>
            <hr style={{ borderColor: "#f0f0f0" }} />
            <div style={{ textAlign: "left", maxHeight: "160px", overflowY: "auto", marginBottom: "12px" }}>
              <p style={{ fontWeight: "600", fontSize: "14px", marginBottom: "8px" }}>Reviews {reviews.length > 0 && `(${reviews.length})`}</p>
              {reviews.length === 0 ? (
                <p style={{ color: "#aaa", fontSize: "13px" }}>No reviews yet. Be the first!</p>
              ) : (
                reviews.map((r) => (
                  <div key={r._id} style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: "8px", marginBottom: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: "600", fontSize: "13px" }}>{r.user?.name || "User"}</span>
                      <span>{renderStars(r.rating, 13)}</span>
                    </div>
                    <p style={{ fontSize: "13px", color: "#555", margin: "4px 0 0" }}>{r.comment}</p>
                  </div>
                ))
              )}
            </div>
            <hr style={{ borderColor: "#f0f0f0" }} />
            <div style={{ textAlign: "left" }}>
              <p style={{ fontWeight: "600", fontSize: "14px", marginBottom: "8px" }}>Write a Review</p>
              {!user ? (
                <p style={{ color: "#888", fontSize: "13px" }}>Please <a href="/login" style={{ color: "#ff4d6d" }}>login</a> to write a review</p>
              ) : (
                <form onSubmit={handleSubmitReview}>
                  {reviewError && <p style={{ color: "#dc2626", fontSize: "12px", marginBottom: "6px" }}>{reviewError}</p>}
                  {reviewSuccess && <p style={{ color: "#16a34a", fontSize: "12px", marginBottom: "6px" }}>{reviewSuccess}</p>}
                  <div style={{ marginBottom: "8px" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} onClick={() => setRating(star)} onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)} style={{ fontSize: "24px", cursor: "pointer", color: star <= (hovered || rating) ? "#ffaa00" : "#ddd" }}>★</span>
                    ))}
                    <span style={{ fontSize: "12px", color: "#888", marginLeft: "6px" }}>
                      {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][hovered || rating]}
                    </span>
                  </div>
                  <textarea rows={3} placeholder="Share your experience..." value={comment} onChange={(e) => setComment(e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "13px", resize: "none", outline: "none", boxSizing: "border-box", marginBottom: "8px" }} />
                  <button type="submit" disabled={submitting} style={{ width: "100%", padding: "8px", background: submitting ? "#ccc" : "#ff4d6d", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "600", fontSize: "13px", cursor: submitting ? "not-allowed" : "pointer" }}>
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShopPage;