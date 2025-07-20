import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/ui/Navbar";
import Home from "./pages/Home";
import ArenaPVP from "./pages/ArenaPVP";
import ArenaPVE from "./pages/ArenaPVE";
import NotFound from "./pages/NotFound"; // Tambahkan ini

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pvp" element={<ArenaPVP />} />
          <Route path="/pve" element={<ArenaPVE />} />
          <Route path="*" element={<NotFound />} /> {/* Tangani route yang tidak dikenal */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
