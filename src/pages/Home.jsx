// src/pages/Home.jsx
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white px-4">
      <h1 className="text-4xl font-bold mb-8">Arena Duel Turn-Based</h1>
      <div className="space-x-4">
        <Link
          to="/arena-pvp"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
        >
          Masuk Arena PvP
        </Link>
        <Link
          to="/arena-pve"
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold"
        >
          Masuk Arena PvE
        </Link>
      </div>
    </div>
  );
};

export default Home;
