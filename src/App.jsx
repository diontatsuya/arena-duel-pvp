import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/ui/Navbar";
import Home from "./pages/Home";
import ArenaPVP from "./pages/ArenaPVP";
import ArenaPVE from "./pages/ArenaPVE";
import NotFound from "./pages/NotFound"; // ← tambahkan ini

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/arena-pvp" element={<ArenaPVP />} />
          <Route path="/arena-pve" element={<ArenaPVE />} />
          <Route path="*" element={<NotFound />} /> {/* ← tambahkan ini */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
