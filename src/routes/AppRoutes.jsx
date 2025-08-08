import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import Home from "../pages/Home";
import ArenaPVP from "../pages/ArenaPVP";
import JoinPVP from "../pages/JoinPVP";
import ArenaBattle from "../pages/ArenaBattle";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/arena-pvp" element={<ArenaPVP />} />
          <Route path="/join-pvp" element={<JoinPVP />} />
          <Route path="/arena-battle/:battleId" element={<ArenaBattle />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRoutes;
