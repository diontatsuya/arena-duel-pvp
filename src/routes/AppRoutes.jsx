// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ArenaPVP from "./pages/ArenaPVP";
import JoinPVP from "./pages/JoinPVP";
import ArenaPVE from "./pages/ArenaPVE";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/arena-pvp" element={<ArenaPVP />} />
          <Route path="/join-pvp" element={<JoinPVP />} />
          <Route path="/arena-pve" element={<ArenaPVE />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
