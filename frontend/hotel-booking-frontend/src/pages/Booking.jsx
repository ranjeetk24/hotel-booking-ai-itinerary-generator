import { useParams, useNavigate, useLocation } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";

// ✅ Fetch hotel details
const GET_HOTEL = gql`
  query GetHotel($id: ID!) {
    hotel(id: $id) {
      id
      name
      location
      price
      imageUrl
      description
    }
  }
`;

// ✅ Create booking
const CREATE_BOOKING = gql`
  mutation CreateBooking(
    $hotelId: ID!
    $checkIn: String!
    $checkOut: String!
    $guests: Int!
  ) {
    createBooking(
      hotelId: $hotelId
      checkIn: $checkIn
      checkOut: $checkOut
      guests: $guests
    ) {
      id
      hotelId
      checkIn
      checkOut
      guests
      totalPrice
    }
  }
`;

// Helper: normalize date to YYYY-MM-DD (for input type="date")
function toIsoDate(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsed = new Date(value);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, "0");
    const d = String(parsed.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return "";
}

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Extract passed state (from HotelDetail or Search)
  const stateData = location.state || {};
  const queryParams = new URLSearchParams(location.search);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  // ✅ Prefill from state or query params on mount
  useEffect(() => {
    const preCheckIn =
      stateData.checkIn || queryParams.get("checkIn") || "";
    const preCheckOut =
      stateData.checkOut || queryParams.get("checkOut") || "";
    const preGuests = stateData.guests || queryParams.get("guests") || 1;

    setCheckIn(toIsoDate(preCheckIn));
    setCheckOut(toIsoDate(preCheckOut));
    setGuests(Number(preGuests));
  }, [stateData, location.search]);

  // ✅ Query hotel details
  const { loading, error, data } = useQuery(GET_HOTEL, { variables: { id } });

  // ✅ Mutation for booking
  const [createBooking, { loading: saving, error: saveError, data: bookingData }] =
    useMutation(CREATE_BOOKING);

  if (loading) return <div className="container py-5">Loading...</div>;
  if (error) return <div className="container py-5 text-danger">Error: {error.message}</div>;

  const hotel = data?.hotel;
  if (!hotel) return <div className="container py-5">Hotel not found.</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createBooking({
      variables: {
        hotelId: hotel.id,
        checkIn,
        checkOut,
        guests: Number(guests),
      },
    });
  };

  const confirmed = bookingData?.createBooking;

  return (
    <div className="container py-5">
      {/* 🔙 Back Button */}
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => {
          if (window.history.length > 1) {
            navigate(-1);
          } else {
            navigate("/search");
          }
        }}
      >
        ← Back
      </button>

      <div className="row g-4">
        {/* Hotel details */}
        <div className="col-lg-6">
          <img
            src={hotel.imageUrl || "https://picsum.photos/600/400"}
            alt={hotel.name}
            className="img-fluid rounded mb-3"
          />
          <h2 className="mb-1">{hotel.name}</h2>
          <p className="text-muted mb-2">{hotel.location}</p>
          <p className="fw-bold">₹{hotel.price} / night</p>
          <p>{hotel.description}</p>
        </div>

        {/* Booking form */}
        <div className="col-lg-6">
          <div className="card p-4 shadow-sm">
            <h4 className="mb-3">Book Your Stay</h4>

            {!confirmed ? (
              <form onSubmit={handleSubmit}>
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
                    required
                  />
                </div>

                {saveError && (
                  <div className="alert alert-danger">
                    {saveError.message}
                  </div>
                )}

                <button type="submit" className="btn btn-success" disabled={saving}>
                  {saving ? "Confirming..." : "Confirm Booking"}
                </button>
              </form>
            ) : (
              <div className="alert alert-success">
                <h5 className="mb-3">Booking Confirmed 🎉</h5>
                <p><strong>Hotel:</strong> {hotel.name}</p>
                <p><strong>Check-in:</strong> {confirmed.checkIn}</p>
                <p><strong>Check-out:</strong> {confirmed.checkOut}</p>
                <p><strong>Guests:</strong> {confirmed.guests}</p>
                <p className="fw-bold"><strong>Total:</strong> ₹{confirmed.totalPrice}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
