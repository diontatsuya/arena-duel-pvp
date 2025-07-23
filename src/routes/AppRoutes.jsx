import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ArenaPVP from "../pages/ArenaPVP";
import ArenaPVE from "../pages/ArenaPVE";
import JoinPVP from "../pages/JoinPVP";
import BattlePVP from "../pages/BattlePVP";
import GameStatus from "../components/ui/GameStatus";
import NotFound from "../pages/NotFound"; // Pastikan file ini ada

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pvp" element={<ArenaPVP />} />
      <Route path="/pve" element={<ArenaPVE />} />
      <Route path="/join-pvp" element={<JoinPVP />} /> {/* ✅ diperbaiki */}
      <Route path="/battle-pvp" element={<BattlePVP />} /> {/* disesuaikan juga */}
      <Route path="/game-status" element={<GameStatus />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
