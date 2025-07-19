// src/pages/Home.jsx
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white p-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-10">Arena Duel</h1>
      <div className="space-x-4">
        <Link to="/pve">
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl text-lg font-semibold shadow-lg transition-all">
            Player vs AI (PvE)
          </button>
        </Link>
        <Link to="/pvp">
          <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-2xl text-lg font-semibold shadow-lg transition-all">
            Player vs Player (PvP)
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
