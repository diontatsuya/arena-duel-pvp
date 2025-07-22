import React from "react";
import WalletStatus from "../components/ui/WalletStatus";

const Home = () => {
  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold mb-4">Arena Duel Turn-Based</h1>
      <p className="mb-6">Selamat datang di arena pertempuran! Pilih mode untuk memulai.</p>

      <WalletStatus />

      <div className="flex justify-center gap-4 mt-6">
        <a
          href="/arena-pvp"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Mode PvP
        </a>
        <a
          href="/arena-pve"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
        >
          Mode PvE
        </a>
      </div>
    </div>
  );
};

export default Home;
