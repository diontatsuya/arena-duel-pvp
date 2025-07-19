import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-purple-400 mb-4 text-center">
        Welcome to Arena Duel
      </h1>
      <p className="text-lg md:text-xl text-gray-300 text-center max-w-2xl mb-8">
        Prepare for battle! Enter the arena and face real opponents in turn-based PVP combat, or challenge the AI in thrilling PVE mode.
      </p>

      <div className="flex gap-6">
        <Link
          to="/pvp"
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl text-lg font-semibold transition"
        >
          Start PVP Duel
        </Link>
        <Link
          to="/pve"
          className="bg-gray-700 hover:bg-gray-800 px-6 py-3 rounded-xl text-lg font-semibold transition"
        >
          Practice with AI
        </Link>
      </div>
    </div>
  );
};

export default Home;
