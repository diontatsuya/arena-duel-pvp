import React from "react";
import { Routes, Route } from "react-router-dom";
import ArenaPVP from "../pages/ArenaPVP";
import JoinPVP from "../pages/JoinPVP";
import ArenaBattle from "../pages/ArenaBattle";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ArenaPVP />} />
      <Route path="/arena-pvp" element={<ArenaPVP />} />
      <Route path="/join-pvp" element={<JoinPVP />} />
      <Route path="/arena-battle" element={<ArenaBattle />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
