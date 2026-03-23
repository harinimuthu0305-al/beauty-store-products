import React, { useState } from "react";

import AnnouncementBar from "../sections/AnnouncementBar";
import HeroBanner from "../sections/HeroBanner";
import BrandHighlights from "../sections/BrandHighlights";
import FeaturedProducts from "../sections/FeaturedProducts";
import ShopByCategory from "../sections/ShopByCategory";
import BestSellers from "../sections/BestSellers";
import SpecialOffer from "../sections/SpecialOffer";
import NewArrivals from "../sections/NewArrivals";

function Home() {
  const [search] = useState("");

  return (
    <div className="home-page">

      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Hero Section */}
      <HeroBanner />

      {/* Brand Highlights Section */}
      <BrandHighlights />

      {/* Featured Products */}
      <section className="section-padding bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-4">Featured Products</h2>
          <FeaturedProducts search={search} />
        </div>
      </section>

      {/* Shop By Category */}
      <section className="section-padding">
        <div className="container">
          <h2 className="text-center fw-bold mb-4"></h2>
          <ShopByCategory />
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section-padding bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-4"></h2>
          <BestSellers search={search} />
        </div>
      </section>

      {/* Special Offer / Promo Banner */}
      <section className="section-padding">
        <SpecialOffer />
      </section>

      {/* New Arrivals */}
      <section className="section-padding bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-4"></h2>
          <NewArrivals search={search} />
        </div>
      </section>

    </div>
  );
}

export default Home;