import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ArenaPVP from "../pages/ArenaPVP";
import ArenaPVE from "../pages/ArenaPVE";
import NotFound from "../pages/NotFound"; // tambahkan ini

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/arena-pvp" element={<ArenaPVP />} />
      <Route path="/arena-pve" element={<ArenaPVE />} />
      <Route path="*" element={<NotFound />} /> {/* fallback 404 */}
    </Routes>
  );
};

export default AppRoutes;
