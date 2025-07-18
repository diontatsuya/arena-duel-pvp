import { useNavigate } from "react-router-dom";

const GameArena = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white px-4">
      <h1 className="text-4xl font-bold mb-8">Arena Duel Turn-Based</h1>

      <div className="flex flex-col sm:flex-row gap-6">
        <button
          onClick={() => navigate("/arena-pvp")}
          className="bg-purple-700 hover:bg-purple-800 px-8 py-4 rounded-2xl text-xl shadow-lg transition"
        >
          ⚔️ Arena PvP
        </button>
        <button
          onClick={() => navigate("/arena-pve")}
          className="bg-green-700 hover:bg-green-800 px-8 py-4 rounded-2xl text-xl shadow-lg transition"
        >
          🤖 Arena PvE
        </button>
      </div>
    </div>
  );
};

export default GameArena;
