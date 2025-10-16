// src/pages/SupplierDashboard.jsx
import { useState, useEffect, useRef } from "react";
import { gql, useLazyQuery, useMutation } from "@apollo/client";

// Paged list of hotels
const GET_HOTELS_PAGE = gql`
  query GetHotelsPage($offset: Int, $limit: Int) {
    hotels(offset: $offset, limit: $limit) {
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

// Create a hotel
const CREATE_HOTEL = gql`
  mutation CreateHotel(
    $name: String!
    $location: String!
    $rating: Int!
    $price: Int!
    $imageUrl: String
    $description: String
  ) {
    createHotel(
      name: $name
      location: $location
      rating: $rating
      price: $price
      imageUrl: $imageUrl
      description: $description
    ) {
      id
      name
    }
  }
`;

// Update a hotel
const UPDATE_HOTEL = gql`
  mutation UpdateHotel(
    $id: ID!
    $name: String!
    $location: String!
    $rating: Int!
    $price: Int!
    $imageUrl: String
    $description: String
  ) {
    updateHotel(
      id: $id
      name: $name
      location: $location
      rating: $rating
      price: $price
      imageUrl: $imageUrl
      description: $description
    ) {
      id
      name
      location
      rating
      price
      imageUrl
      description
    }
  }
`;

// Delete a hotel (Boolean)
const DELETE_HOTEL = gql`
  mutation DeleteHotel($id: ID!) {
    deleteHotel(id: $id)
  }
`;

export default function SupplierDashboard() {
  const PAGE_SIZE = 9;

  // Create form
  const [form, setForm] = useState({
    name: "",
    location: "",
    price: "",
    rating: "",
    imageUrl: "",
    description: "",
  });

  // List state
  const [offset, setOffset] = useState(0);
  const [hotels, setHotels] = useState([]);
  const [total, setTotal] = useState(0);

  // Edit modal state
  const [editing, setEditing] = useState(null); // hotel object or null
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    location: "",
    price: "",
    rating: "",
    imageUrl: "",
    description: "",
  });

  // Success messages
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState(null);
  const [createSuccessMessage, setCreateSuccessMessage] = useState(null);

  // Optional ref for Bootstrap JS modal (not required here)
  const editModalRef = useRef(null);

  // Queries & mutations
  const [loadHotels, { loading, error }] = useLazyQuery(GET_HOTELS_PAGE, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      const page = data?.hotels;
      if (!page) return;

      if (offset === 0) {
        setHotels(page.content);
      } else {
        setHotels((prev) => [...prev, ...page.content]);
      }
      setTotal(page.totalElements ?? 0);
    },
  });

  const [createHotel, { loading: saving, error: saveError }] =
    useMutation(CREATE_HOTEL);

  const [updateHotel, { loading: updating, error: updateError }] =
    useMutation(UPDATE_HOTEL);

  const [deleteHotel, { loading: deleting, error: deleteError }] =
    useMutation(DELETE_HOTEL);

  // Initial load
  useEffect(() => {
    loadHotels({ variables: { offset: 0, limit: PAGE_SIZE } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshFirstPage = async () => {
    setOffset(0);
    await loadHotels({ variables: { offset: 0, limit: PAGE_SIZE } });
  };

  // Create
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const res = await createHotel({
      variables: {
        name: form.name,
        location: form.location,
        rating: parseInt(form.rating, 10),
        price: parseInt(form.price, 10),
        imageUrl: form.imageUrl || null,
        description: form.description || null,
      },
    });

    if (res.data?.createHotel?.id) {
      setCreateSuccessMessage("Hotel created successfully ✅");
      setTimeout(() => setCreateSuccessMessage(null), 3000);
    }

    setForm({
      name: "",
      location: "",
      price: "",
      rating: "",
      imageUrl: "",
      description: "",
    });
    await refreshFirstPage();
  };

  // Open edit
  const openEdit = (hotel) => {
    setEditing(hotel);
    setEditForm({
      id: hotel.id,
      name: hotel.name,
      location: hotel.location,
      price: String(hotel.price),
      rating: String(hotel.rating),
      imageUrl: hotel.imageUrl || "",
      description: hotel.description || "",
    });
  };

  // Submit edit
  const handleEditSubmit = async (e) => {
    if (e) e.preventDefault();
    const res = await updateHotel({
      variables: {
        id: editForm.id,
        name: editForm.name,
        location: editForm.location,
        rating: parseInt(editForm.rating, 10),
        price: parseInt(editForm.price, 10),
        imageUrl: editForm.imageUrl || null,
        description: editForm.description || null,
      },
    });

    if (res.data?.updateHotel?.id) {
      setUpdateSuccessMessage("Hotel updated successfully ✅");
      setTimeout(() => setUpdateSuccessMessage(null), 3000);
    }

    setEditing(null);
    await refreshFirstPage();
  };

  // Delete
  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this hotel?");
    if (!ok) return;
    const res = await deleteHotel({ variables: { id } });
    if (res.data?.deleteHotel) {
      setDeleteMessage("Hotel deleted successfully ✅");
      await refreshFirstPage();
    } else {
      setDeleteMessage("Failed to delete hotel ❌");
    }
    setTimeout(() => setDeleteMessage(null), 3000);
  };

  // Load more
  const handleLoadMore = () => {
    const newOffset = offset + PAGE_SIZE;
    setOffset(newOffset);
    loadHotels({ variables: { offset: newOffset, limit: PAGE_SIZE } });
  };

  const canLoadMore = hotels.length < total;

  return (
    <div className="container py-5">
      <h1 className="mb-4">Supplier Dashboard</h1>

      {/* Success banners */}
      {createSuccessMessage && (
        <div className="alert alert-success">{createSuccessMessage}</div>
      )}
      {updateSuccessMessage && (
        <div className="alert alert-success">{updateSuccessMessage}</div>
      )}
      {deleteMessage && (
        <div className="alert alert-success">{deleteMessage}</div>
      )}

      {/* Error banners */}
      {deleteError && (
        <div className="alert alert-danger">Delete error: {deleteError.message}</div>
      )}
      {updateError && (
        <div className="alert alert-danger">Update error: {updateError.message}</div>
      )}

      {/* Create Hotel */}
      <form onSubmit={handleCreateSubmit} className="card p-4 shadow-sm mb-5">
        <h4 className="mb-3">Add New Hotel</h4>

        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              name="name"
              placeholder="Hotel Name"
              className="form-control"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>

          <div className="col-md-6">
            <input
              type="text"
              name="location"
              placeholder="Location"
              className="form-control"
              value={form.location}
              onChange={(e) =>
                setForm((f) => ({ ...f, location: e.target.value }))
              }
              required
            />
          </div>

          <div className="col-md-4">
            <input
              type="number"
              name="price"
              placeholder="Price per night"
              className="form-control"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              required
              min="0"
            />
          </div>

          <div className="col-md-4">
            <input
              type="number"
              name="rating"
              placeholder="Rating (1-5)"
              className="form-control"
              value={form.rating}
              onChange={(e) =>
                setForm((f) => ({ ...f, rating: e.target.value }))
              }
              required
              min="1"
              max="5"
            />
          </div>

          <div className="col-md-4">
            <input
              type="text"
              name="imageUrl"
              placeholder="Image URL"
              className="form-control"
              value={form.imageUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, imageUrl: e.target.value }))
              }
            />
          </div>

          <div className="col-12">
            <textarea
              name="description"
              placeholder="Description"
              className="form-control"
              rows="3"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            ></textarea>
          </div>
        </div>

        {saveError && (
          <div className="alert alert-danger mt-3">{saveError.message}</div>
        )}

        <button type="submit" className="btn btn-primary mt-3" disabled={saving}>
          {saving ? "Saving..." : "Add Hotel"}
        </button>
      </form>

      {/* List */}
      <h4 className="mb-3">Your Hotels</h4>

      {loading && offset === 0 && <p>Loading hotels...</p>}
      {error && <p className="text-danger">Error: {error.message}</p>}

      <div className="row g-4">
        {hotels.length > 0 ? (
          hotels.map((hotel) => (
            <div className="col-sm-6 col-md-4" key={hotel.id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={
                    hotel.imageUrl && hotel.imageUrl.trim() !== ""
                      ? hotel.imageUrl
                      : "https://picsum.photos/400/250"
                  }
                  className="card-img-top"
                  alt={hotel.name}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{hotel.name}</h5>
                  <p className="text-muted mb-1">{hotel.location}</p>
                  <p className="mb-1">⭐ {hotel.rating ?? 0}</p>
                  <p className="fw-bold">₹{hotel.price} / night</p>
                  <p className="mt-2 flex-grow-1">{hotel.description}</p>

                  <div className="d-flex gap-2 mt-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => openEdit(hotel)}
                      disabled={updating}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(hotel.id)}
                      disabled={deleting}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          !loading && <p>No hotels yet.</p>
        )}
      </div>

      {/* Load More */}
      {canLoadMore && (
        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn btn-outline-primary"
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading && offset > 0 ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {/* Edit Modal (CSS-only) */}
      {editing && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          ref={editModalRef}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Hotel</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditing(null)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleEditSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, name: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.location}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            location: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Price</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        value={editForm.price}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, price: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Rating (1-5)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        className="form-control"
                        value={editForm.rating}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, rating: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Image URL</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.imageUrl}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            imageUrl: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <textarea
                        rows="3"
                        className="form-control"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            description: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  {updateError && (
                    <div className="alert alert-danger mt-3">
                      {updateError.message}
                    </div>
                  )}
                </form>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleEditSubmit}
                  disabled={updating}
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
