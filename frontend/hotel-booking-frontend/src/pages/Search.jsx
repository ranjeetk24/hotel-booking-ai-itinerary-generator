// src/pages/Search.jsx
import { gql, useLazyQuery } from "@apollo/client";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

// GraphQL: HotelPage { content, totalElements }
const SEARCH_HOTELS = gql`
  query SearchHotels(
    $keyword: String
    $location: String
    $checkIn: String
    $checkOut: String
    $offset: Int
    $limit: Int
  ) {
    hotels(
      keyword: $keyword
      location: $location
      checkIn: $checkIn
      checkOut: $checkOut
      offset: $offset
      limit: $limit
    ) {
      totalElements
      content {
        id
        name
        location
        rating
        price
        imageUrl
        description
      }
    }
  }
`;

/** Normalize to YYYY-MM-DD (safe for input[type="date"]) */
function toIsoDate(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const dmy = value.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmy) {
    const [, d, m, y] = dmy;
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }
  const parsed = new Date(value);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, "0");
    const d = String(parsed.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return "";
}

export default function Search() {
  const PAGE_SIZE = 6;
  const locationHook = useLocation();
  const navigate = useNavigate();

  // Read URL params once per navigation
  const urlParams = useMemo(() => new URLSearchParams(locationHook.search), [locationHook.search]);

  // Prefill from URL params
  const [filters, setFilters] = useState({
    keyword: urlParams.get("keyword") || "",
    location: urlParams.get("location") || "",
    checkIn: urlParams.get("checkIn") || "",
    checkOut: urlParams.get("checkOut") || "",
    guests: urlParams.get("guests") || "1",
  });

  const [offset, setOffset] = useState(0);
  const [hotels, setHotels] = useState([]);
  const [total, setTotal] = useState(0);

  const [searchHotels, { loading, error }] = useLazyQuery(SEARCH_HOTELS, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      const page = data?.hotels;
      if (!page) return;

      if (offset === 0) {
        setHotels(page.content || []);
      } else {
        setHotels((prev) => [...prev, ...(page.content || [])]);
      }
      setTotal(page.totalElements ?? 0);
    },
  });

  // Helper: push current filters into the URL (so refresh/share keeps state)
  const pushFiltersToUrl = (nextFilters) => {
    const params = new URLSearchParams();
    if (nextFilters.keyword) params.set("keyword", nextFilters.keyword);
    if (nextFilters.location) params.set("location", nextFilters.location);
    if (nextFilters.checkIn) params.set("checkIn", toIsoDate(nextFilters.checkIn));
    if (nextFilters.checkOut) params.set("checkOut", toIsoDate(nextFilters.checkOut));
    if (nextFilters.guests) params.set("guests", String(nextFilters.guests));
    const qs = params.toString();
    navigate({ pathname: "/search", search: qs ? `?${qs}` : "" }, { replace: true });
  };

  // Run initial search when landing with URL params (or on route change)
  useEffect(() => {
    const initial = {
      keyword: urlParams.get("keyword") || "",
      location: urlParams.get("location") || "",
      checkIn: urlParams.get("checkIn") || "",
      checkOut: urlParams.get("checkOut") || "",
      guests: urlParams.get("guests") || "1",
    };
    setFilters(initial);
    setOffset(0);
    searchHotels({
      variables: {
        keyword: initial.keyword || null,
        location: initial.location || null,
        checkIn: initial.checkIn || null,
        checkOut: initial.checkOut || null,
        offset: 0,
        limit: PAGE_SIZE,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationHook.search]);

  const handleSearch = () => {
    setOffset(0);
    pushFiltersToUrl(filters);
    searchHotels({
      variables: {
        keyword: filters.keyword || null,
        location: filters.location || null,
        checkIn: filters.checkIn || null,
        checkOut: filters.checkOut || null,
        offset: 0,
        limit: PAGE_SIZE,
      },
    });
  };

  const handleLoadMore = () => {
    const newOffset = offset + PAGE_SIZE;
    setOffset(newOffset);
    searchHotels({
      variables: {
        keyword: filters.keyword || null,
        location: filters.location || null,
        checkIn: filters.checkIn || null,
        checkOut: filters.checkOut || null,
        offset: newOffset,
        limit: PAGE_SIZE,
      },
    });
  };

  const handleClear = () => {
    const cleared = { keyword: "", location: "", checkIn: "", checkOut: "", guests: "1" };
    setFilters(cleared);
    setOffset(0);
    pushFiltersToUrl(cleared);
    searchHotels({ variables: { offset: 0, limit: PAGE_SIZE } });
  };

  const canLoadMore = hotels.length < total;

  // Build Link target: pass state + add query params fallback
  const linkToHotel = (hotelId) => {
    const state = {
      checkIn: toIsoDate(filters.checkIn),
      checkOut: toIsoDate(filters.checkOut),
      guests: Number(filters.guests) || 1,
    };

    const params = new URLSearchParams();
    if (state.checkIn) params.set("checkIn", state.checkIn);
    if (state.checkOut) params.set("checkOut", state.checkOut);
    if (state.guests) params.set("guests", String(state.guests));
    const qs = params.toString();
    return { pathname: `/hotel/${hotelId}`, search: qs ? `?${qs}` : "", state };
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Search Hotels</h1>

      {/* Filters */}
      <form
        className="card p-4 shadow-sm mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <div className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              placeholder="Search by hotel name..."
              className="form-control"
              value={filters.keyword}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              placeholder="Location..."
              className="form-control"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={toIsoDate(filters.checkIn)}
              onChange={(e) => setFilters({ ...filters, checkIn: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={toIsoDate(filters.checkOut)}
              onChange={(e) => setFilters({ ...filters, checkOut: e.target.value })}
            />
          </div>
          <div className="col-md-2 d-grid gap-2">
            <button type="submit" className="btn btn-primary">
              Search
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>
      </form>

      {/* Results */}
      {loading && offset === 0 && <p>Loading hotels...</p>}
      {error && <p className="text-danger">Error: {error.message}</p>}

      <div className="row g-4">
        {hotels.length > 0 ? (
          hotels.map((hotel) => (
            <div className="col-sm-6 col-md-4" key={hotel.id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={hotel.imageUrl && hotel.imageUrl.trim() !== "" ? hotel.imageUrl : "https://picsum.photos/400/250"}
                  className="card-img-top"
                  alt={hotel.name}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{hotel.name}</h5>
                  <p className="card-text text-muted">{hotel.location}</p>
                  <p className="mb-2">⭐ {hotel.rating ?? 0}</p>
                  <p className="fw-bold mb-2">₹{hotel.price} / night</p>
                  <Link to={linkToHotel(hotel.id)} className="btn btn-primary mt-auto">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          !loading && <p>No hotels match your search.</p>
        )}
      </div>

      {/* Load More */}
      {canLoadMore && (
        <div className="d-flex justify-content-center mt-4">
          <button className="btn btn-outline-primary" onClick={handleLoadMore} disabled={loading}>
            {loading && offset > 0 ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
