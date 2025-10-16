// src/pages/HotelDetail.jsx
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

const GET_HOTEL = gql`
  query GetHotel($id: ID!) {
    hotel(id: $id) {
      id
      name
      location
      description
      price
      rating
      imageUrl
    }
  }
`;

/** convert many formats into YYYY-MM-DD for <input type="date"> */
function toIsoDate(value) {
  if (!value) return "";
  // already ISO-like 2025-10-15
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  // common dd/mm/yyyy or dd-mm-yyyy
  const dmy = value.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmy) {
    const [, d, m, y] = dmy;
    const dd = d.padStart(2, "0");
    const mm = m.padStart(2, "0");
    return `${y}-${mm}-${dd}`;
  }
  // try Date parse fallback (may be unreliable)
  const parsed = new Date(value);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, "0");
    const d = String(parsed.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return "";
}

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, data } = useQuery(GET_HOTEL, { variables: { id } });

  // initialize empty, then attempt to prefill from location.state or query params
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  // On mount, read from location.state (navigate state), then fallback to query params.
  useEffect(() => {
    // 1) If previous route used navigate(..., { state: { checkIn, checkOut, guests } })
    if (location?.state) {
      const s = location.state;
      // if state contains values, normalize them
      if (s.checkIn) setCheckIn(toIsoDate(s.checkIn));
      if (s.checkOut) setCheckOut(toIsoDate(s.checkOut));
      if (s.guests) setGuests(Number(s.guests) || 1);
    }

    // 2) fallback: query params like /hotel/123?checkIn=2025-10-01&checkOut=2025-10-05
    const params = new URLSearchParams(location.search);
    const qIn = params.get("checkIn");
    const qOut = params.get("checkOut");
    const qGuests = params.get("guests");
    if (qIn && !checkIn) setCheckIn(toIsoDate(qIn));
    if (qOut && !checkOut) setCheckOut(toIsoDate(qOut));
    if (qGuests && (!guests || guests === 1)) setGuests(Number(qGuests) || 1);

    // debug log to help you verify values in console
    // remove or comment out in production
    // eslint-disable-next-line no-console
    console.log("HotelDetail init state:", { fromState: location.state, query: location.search });
    // we purposely run this effect on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading)
    return <div className="container py-5 text-center">Loading hotel details...</div>;
  if (error)
    return (
      <div className="container py-5 text-center text-danger">
        Error: {error.message}
      </div>
    );

  const hotel = data?.hotel;
  if (!hotel)
    return <div className="container py-5 text-center">Hotel not found.</div>;

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      alert("Please select both check-in and check-out dates before proceeding.");
      return;
    }

    navigate(`/booking/${hotel.id}`, {
      state: {
        checkIn,
        checkOut,
        guests,
        hotelName: hotel.name,
      },
    });
  };

  return (
    <div className="container py-5">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="btn btn-outline-secondary mb-3">
        ← Back
      </button>

      <div className="row g-4 align-items-start">
        <div className="col-lg-6">
          <img
            src={hotel.imageUrl || "https://picsum.photos/600/400"}
            alt={hotel.name}
            className="img-fluid rounded shadow-sm mb-3"
          />
        </div>

        <div className="col-lg-6">
          <h2 className="fw-bold mb-2">{hotel.name}</h2>
          <p className="text-muted mb-1">{hotel.location}</p>
          <p className="fw-bold fs-5 text-success mb-3">₹{hotel.price} / night</p>

          <p className="mb-4">{hotel.description}</p>

          <div className="card p-4 shadow-sm">
            <h5 className="mb-3">Book Your Stay</h5>

            <div className="mb-3">
              <label className="form-label">Check-in</label>
              <input
                type="date"
                className="form-control"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Check-out</label>
              <input
                type="date"
                className="form-control"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Guests</label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              />
            </div>

            <button onClick={handleBooking} className="btn btn-primary w-100">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
