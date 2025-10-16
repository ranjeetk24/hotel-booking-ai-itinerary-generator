let hotels = [
  {
    id: 1,
    name: "The Grand Delhi",
    location: "Delhi",
    rating: 4,
    price: 3500,
    imageUrl: "https://picsum.photos/400/250?random=1",
    description: "Luxury hotel in Delhi with premium rooms and spa facilities.",
  },
  {
    id: 2,
    name: "Sea Breeze Resort",
    location: "Goa",
    rating: 5,
    price: 5500,
    imageUrl: "https://picsum.photos/400/250?random=2",
    description: "Beachside resort with ocean views and private villas.",
  },
  {
    id: 3,
    name: "City Comfort Inn",
    location: "Mumbai",
    rating: 3,
    price: 2200,
    imageUrl: "https://picsum.photos/400/250?random=3",
    description: "Budget-friendly hotel in central Mumbai with easy access.",
  },
];

export function getHotels(query = "") {
  return hotels.filter((h) =>
    h.name.toLowerCase().includes(query.toLowerCase())
  );
}

export function getHotelById(id) {
  return hotels.find((h) => h.id === Number(id));
}

export function addHotel(newHotel) {
  const id = hotels.length + 1;
  const hotel = { id, ...newHotel };
  hotels.push(hotel);
  return hotel;
}

export function getAllHotels() {
  return hotels;
}
