// src/pages/Home.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [form, setForm] = useState({
    keyword: "",
    location: "",
    checkIn: "",
    checkOut: "",
  });
  const navigate = useNavigate();

  const goSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (form.keyword) params.set("keyword", form.keyword);
    if (form.location) params.set("location", form.location);
    if (form.checkIn) params.set("checkIn", form.checkIn);
    if (form.checkOut) params.set("checkOut", form.checkOut);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <>
      {/* === HERO (video) === */}
      <div className="hero-under-nav position-relative vh-100 overflow-hidden">
        <video
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ objectFit: "cover" }}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
        >
          <source src="/home.mp4" type="video/mp4" />
        </video>

        {!videoLoaded && (
          <img
            src="/home.png"
            alt="Backdrop"
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{ objectFit: "cover" }}
          />
        )}

        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>

        <div className="position-relative d-flex flex-column justify-content-center align-items-center h-100 text-white text-center px-3">
          <div className="mt-5">
            <h1 className="display-4 fw-bold mb-3">Find Your Perfect Stay</h1>
            <p className="lead mb-4">
              Discover hand-picked hotels, sharp prices, and instant booking.
            </p>

            {/* Quick Search */}
            <form
              onSubmit={goSearch}
              className="bg-white rounded-3 shadow p-3 p-md-4 text-start"
              style={{ maxWidth: 980, width: "100%" }}
            >
              <div className="row g-2 g-md-3 align-items-end">
                <div className="col-12 col-md-4">
                  <label className="form-label text-dark mb-1">Hotel name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Taj, Oberoi…"
                    value={form.keyword}
                    onChange={(e) => setForm((f) => ({ ...f, keyword: e.target.value }))}
                  />
                </div>
                <div className="col-12 col-md-3">
                  <label className="form-label text-dark mb-1">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="City or area"
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  />
                </div>
                <div className="col-6 col-md-2">
                  <label className="form-label text-dark mb-1">Check-in</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.checkIn}
                    onChange={(e) => setForm((f) => ({ ...f, checkIn: e.target.value }))}
                  />
                </div>
                <div className="col-6 col-md-2">
                  <label className="form-label text-dark mb-1">Check-out</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.checkOut}
                    onChange={(e) => setForm((f) => ({ ...f, checkOut: e.target.value }))}
                  />
                </div>
                <div className="col-12 col-md-1 d-grid">
                  <button className="btn btn-primary" type="submit">Search</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* === Popular Destinations === */}
      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-end mb-3">
          <h2 className="mb-0">Popular Destinations</h2>
          <Link to="/search" className="text-decoration-none">View all →</Link>
        </div>
        <div className="row g-4">
          {[
            { city: "Goa", img: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800" },
            { city: "Jaipur", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800" },
            { city: "Manali", img: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=800" },
            { city: "Mumbai", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800" },
          ].map((d) => (
            <div className="col-6 col-md-3" key={d.city}>
              <Link to={`/search?location=${encodeURIComponent(d.city)}`} className="text-decoration-none text-dark">
                <div className="card border-0 shadow-sm h-100">
                  <img src={d.img} className="card-img-top" alt={d.city} style={{ height: 160, objectFit: "cover" }} />
                  <div className="card-body">
                    <h5 className="card-title mb-0">{d.city}</h5>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* === Why Book With Us === */}
      <section className="bg-light">
        <div className="container py-5">
          <h2 className="mb-4 text-center">Why Book With Us</h2>
          <div className="row g-4">
            {[
              { icon: "💸", title: "Best Prices", text: "Transparent pricing with no hidden fees." },
              { icon: "⚡", title: "Instant Booking", text: "Real-time availability & instant confirmation." },
              { icon: "🛎️", title: "Hand-picked Stays", text: "Curated list of quality hotels." },
              { icon: "🛡️", title: "Secure Payments", text: "PCI-compliant, industry-standard security." },
            ].map((f) => (
              <div className="col-6 col-md-3" key={f.title}>
                <div className="text-center p-3 h-100 card border-0 shadow-sm">
                  <div style={{ fontSize: 34 }}>{f.icon}</div>
                  <h6 className="mt-2 mb-1">{f.title}</h6>
                  <p className="mb-0 text-muted">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Featured Picks === */}
      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-end mb-3">
          <h2 className="mb-0">Featured Picks</h2>
          <Link to="/search" className="text-decoration-none">Explore →</Link>
        </div>
        <div className="row g-4">
          {[
            {
              name: "Seaside Retreat",
              location: "Goa",
              price: 4500,
              img: "https://images.unsplash.com/photo-1501117716987-c8e3f3a0e0f1?q=80&w=800",
            },
            {
              name: "Mountain View Inn",
              location: "Manali",
              price: 3800,
              img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800",
            },
            {
              name: "Heritage Palace",
              location: "Jaipur",
              price: 5200,
              img: "https://images.unsplash.com/photo-1571907480495-7d121b4a9c37?q=80&w=800",
            },
          ].map((h) => (
            <div className="col-md-4" key={h.name}>
              <div className="card h-100 shadow-sm">
                <img src={h.img} alt={h.name} className="card-img-top" style={{ height: 220, objectFit: "cover" }} />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{h.name}</h5>
                  <p className="text-muted mb-1">{h.location}</p>
                  <p className="fw-bold mb-3">₹{h.price} / night</p>
                  <Link to={`/search?location=${encodeURIComponent(h.location)}`} className="btn btn-outline-primary mt-auto">
                    Check Availability
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === Testimonials === */}
      <section className="bg-light">
        <div className="container py-5">
          <h2 className="mb-4 text-center">What Guests Say</h2>
          <div id="testimonials" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {[
                { name: "Aarav", text: "Smooth booking, great prices. Found a lovely boutique stay in Jaipur!" },
                { name: "Riya", text: "Clean UI and instant confirmation. My go-to for weekend trips." },
                { name: "Kabir", text: "Loved the curated picks. The Manali property was exactly as shown." },
              ].map((t, i) => (
                <div className={`carousel-item ${i === 0 ? "active" : ""}`} key={t.name}>
                  <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: 720 }}>
                    <div className="card-body p-4 p-md-5 text-center">
                      <p className="lead mb-3">“{t.text}”</p>
                      <div className="fw-semibold">— {t.name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#testimonials" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#testimonials" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </section>

      {/* === FAQ === */}
      <section className="container py-5">
        <h2 className="mb-4 text-center">Frequently Asked Questions</h2>
        <div className="accordion mx-auto" id="faq" style={{ maxWidth: 900 }}>
          {[
            {
              q: "Can I cancel my booking?",
              a: "Cancellation depends on the hotel’s policy shown during booking. Many stays offer free cancellation within a window.",
            },
            {
              q: "Do prices include taxes?",
              a: "Yes—final price shown includes all applicable taxes and fees before you confirm.",
            },
            {
              q: "How do you handle payments?",
              a: "We use secure, PCI-compliant payment gateways. Your card details are never stored on our servers.",
            },
          ].map((f, i) => (
            <div className="accordion-item" key={f.q}>
              <h2 className="accordion-header" id={`faq-h-${i}`}>
                <button
                  className={`accordion-button ${i !== 0 ? "collapsed" : ""}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#faq-c-${i}`}
                  aria-expanded={i === 0 ? "true" : "false"}
                  aria-controls={`faq-c-${i}`}
                >
                  {f.q}
                </button>
              </h2>
              <div
                id={`faq-c-${i}`}
                className={`accordion-collapse collapse ${i === 0 ? "show" : ""}`}
                aria-labelledby={`faq-h-${i}`}
                data-bs-parent="#faq"
              >
                <div className="accordion-body">{f.a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>




      {/* === For Travel Pros (AI Section) === */}
<section className="container py-5">
  <h2 className="mb-4 text-center">For Travel Pros</h2>
  <p className="text-center text-muted mb-5">
    Unlock the power of AI to plan smarter, book faster, and wow your clients.
  </p>

  <div className="row g-4">
    <div className="col-md-4">
      <div className="card h-100 shadow-sm border-0">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">✈️ AI Itinerary Generator</h5>
          <p className="card-text flex-grow-1">
            Generate custom travel itineraries in seconds. Perfect for agents and frequent travelers.
          </p>
         <Link to="/ai" className="btn btn-primary mt-auto">
  Try It Now
</Link>
        </div>
      </div>
    </div>

    <div className="col-md-4">
      <div className="card h-100 shadow-sm border-0">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">💰 Smart Pricing Insights</h5>
          <p className="card-text flex-grow-1">
            Get AI-powered recommendations for the best times to book and save on hotels.
          </p>
          <Link to="/search" className="btn btn-outline-primary mt-auto">
            Explore Deals
          </Link>
        </div>
      </div>
    </div>

    <div className="col-md-4">
      <div className="card h-100 shadow-sm border-0">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">🌍 Personalized Picks</h5>
          <p className="card-text flex-grow-1">
            Let AI suggest properties tailored to your style and preferences.
          </p>
          <Link to="/search" className="btn btn-outline-primary mt-auto">
            See Recommendations
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>

{/* === AI Itinerary Modal === */}
<div
  className="modal fade"
  id="aiItineraryModal"
  tabIndex="-1"
  aria-hidden="true"
>
  <div className="modal-dialog modal-lg modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">AI Travel Itinerary Generator</h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div className="modal-body">
        <form id="aiForm" className="mb-3">
          <div className="mb-3">
            <label className="form-label">Destination</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Goa, Manali, Jaipur"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Number of Days</label>
            <input type="number" className="form-control" min="1" max="30" />
          </div>
          <div className="mb-3">
            <label className="form-label">Travel Style</label>
            <select className="form-select">
              <option>Relaxation</option>
              <option>Adventure</option>
              <option>Luxury</option>
              <option>Budget</option>
              <option>Family</option>
            </select>
          </div>
          <button type="button" className="btn btn-success">
            Generate Itinerary
          </button>
        </form>

        <div
          id="aiResult"
          className="bg-light p-3 rounded"
          style={{ minHeight: "100px" }}
        >
          <em>Your AI-generated itinerary will appear here...</em>
        </div>
      </div>
    </div>
  </div>
</div>


      {/* === CTA Banner === */}
      <section className="bg-primary text-white">
        <div className="container py-5 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <div>
            <h3 className="mb-1">Ready for your next trip?</h3>
            <p className="mb-0">Search thousands of hotels across India—hand-picked and fairly priced.</p>
          </div>
          <Link to="/search" className="btn btn-light btn-lg">Search Hotels</Link>
        </div>
      </section>
    </>
  );
}
