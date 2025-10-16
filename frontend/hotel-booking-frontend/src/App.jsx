import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Search from "./pages/Search";
import HotelDetail from "./pages/HotelDetail";
import Booking from "./pages/Booking";
import SupplierDashboard from "./pages/SupplierDashboard";
import AiChat from "./pages/AiChat";

export default function App() {
  return (
    <Router>
      <Navbar />
      {/* 👇 This wrapper expands to fill available height */}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/hotel/:id" element={<HotelDetail />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/dashboard" element={<SupplierDashboard />} />
          <Route path="/ai" element={<AiChat />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
