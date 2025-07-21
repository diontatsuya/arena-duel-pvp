// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ArenaPVP from "../pages/ArenaPVP";
import ArenaPVE from "../pages/ArenaPVE";
import GamePVP from "../gameLogic/GamePVP";
import GamePVE from "../gameLogic/GamePVE";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/arena-pvp" element={<ArenaPVP />} />
      <Route path="/arena-pve" element={<ArenaPVE />} />
      <Route path="/game/pvp" element={<GamePVP />} />
      <Route path="/game/pve" element={<GamePVE />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
