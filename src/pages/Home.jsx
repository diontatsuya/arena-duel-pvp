// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-black text-white text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">Arena Duel</h1>
      <p className="text-lg md:text-xl mb-10">
        Selamat datang di Arena Duel! Pilih mode permainan:
      </p>
      <div className="flex flex-col md:flex-row gap-6">
        <Link
          to="/pve"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-lg font-semibold shadow-lg"
        >
          Player vs Environment (PVE)
        </Link>
        <Link
          to="/pvp"
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl text-lg font-semibold shadow-lg"
        >
          Player vs Player (PVP)
        </Link>
      </div>
    </div>
  );
};

export default Home;
