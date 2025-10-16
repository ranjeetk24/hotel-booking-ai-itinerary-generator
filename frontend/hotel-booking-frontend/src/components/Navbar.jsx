// src/components/Navbar.jsx
import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { pathname } = useLocation();
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Transparent only on home + near top
  const isTransparent = pathname === "/" && atTop;

  const navbarClass =
    `navbar fixed-top navbar-expand-lg ${
      isTransparent
        ? "navbar-dark bg-transparent"
        : "navbar-light bg-white shadow-sm"
    }`;

  return (
    <nav
      className={navbarClass}
      style={{ transition: "background-color 250ms ease, box-shadow 250ms ease" }}
    >
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
          <span role="img" aria-label="hotel">🏨</span> HotelBooking
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav links */}
        <div id="mainNav" className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li className="nav-item">
              <NavLink className="nav-link" to="/search">Search</NavLink>
            </li>
              <li className="nav-item">
              <NavLink to="/ai" className="nav-link">
                AI Itinerary Generator
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/dashboard">Supplier Dashboard</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
