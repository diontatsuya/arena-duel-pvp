// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ArenaPVE from "./pages/ArenaPVE";
import ArenaPVP from "./pages/ArenaPVP";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pve" element={<ArenaPVE />} />
          <Route path="/pvp" element={<ArenaPVP />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
