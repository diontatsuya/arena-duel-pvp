import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ArenaPVP from "../pages/ArenaPVP";
import ArenaPVE from "../pages/ArenaPVE";
import PVPJoin from "../pages/PVPJoin";
import NotFound from "../pages/NotFound"; // Pastikan file ini ada

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pvp" element={<ArenaPVP />} />
      <Route path="/pve" element={<ArenaPVE />} />
      <Route path="/join-pvp" element={<PVPJoin />} /> {/* ✅ route baru */}
      <Route path="*" element={<NotFound />} /> {/* Tambahkan ini */}
    </Routes>
  );
};

export default AppRoutes;
