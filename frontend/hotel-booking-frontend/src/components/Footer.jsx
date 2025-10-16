import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white text-dark border-top mt-5">
      <div className="container py-5">
        <div className="row">
          {/* Brand */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h5 className="fw-bold">HotelBooking</h5>
            <p className="text-muted small">
              Discover and book the best hotels across India at unbeatable prices.
            </p>
          </div>

          {/* Company */}
          <div className="col-6 col-md-2 mb-4 mb-md-0">
            <h6 className="fw-semibold">Company</h6>
            <ul className="list-unstyled small">
              <li><Link to="/" className="text-decoration-none text-muted">About Us</Link></li>
              <li><Link to="/" className="text-decoration-none text-muted">Careers</Link></li>
              <li><Link to="/" className="text-decoration-none text-muted">Press</Link></li>
            </ul>
          </div>

          {/* Explore */}
          <div className="col-6 col-md-3 mb-4 mb-md-0">
            <h6 className="fw-semibold">Explore</h6>
            <ul className="list-unstyled small">
              <li><Link to="/search?location=Goa" className="text-decoration-none text-muted">Goa Hotels</Link></li>
              <li><Link to="/search?location=Manali" className="text-decoration-none text-muted">Manali Hotels</Link></li>
              <li><Link to="/search?location=Jaipur" className="text-decoration-none text-muted">Jaipur Hotels</Link></li>
              <li><Link to="/search?location=Mumbai" className="text-decoration-none text-muted">Mumbai Hotels</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-6 col-md-2 mb-4 mb-md-0">
            <h6 className="fw-semibold">Support</h6>
            <ul className="list-unstyled small">
              <li><Link to="/faq" className="text-decoration-none text-muted">FAQ</Link></li>
              <li><Link to="/contact" className="text-decoration-none text-muted">Contact</Link></li>
              <li><Link to="/help" className="text-decoration-none text-muted">Help Center</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div className="col-6 col-md-2">
            <h6 className="fw-semibold">Follow Us</h6>
            <div className="d-flex gap-3">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-decoration-none">
                <i className="bi bi-twitter fs-4 text-primary"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-decoration-none">
                <i className="bi bi-instagram fs-4" style={{ color: "#E4405F" }}></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-decoration-none">
                <i className="bi bi-facebook fs-4 text-primary"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-decoration-none">
                <i className="bi bi-linkedin fs-4" style={{ color: "#0A66C2" }}></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-light text-center py-3 border-top">
        <small className="text-muted">
          © {new Date().getFullYear()} HotelBooking Inc. All rights reserved.
        </small>
      </div>
    </footer>
  );
}
