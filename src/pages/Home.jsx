import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4">
      <h1 className="text-4xl font-bold mb-4">Arena Duel Turn-Based</h1>
      <p className="text-lg mb-8 text-center max-w-md">
        Selamat datang di game PvP dan PvE berbasis giliran di jaringan testnet Somnia.
        Login dengan MetaMask dan mulai bertarung!
      </p>
      <div className="flex space-x-4">
        <Link
          to="/arena-pvp"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition"
        >
          Arena PvP
        </Link>
        <Link
          to="/arena-pve"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition"
        >
          Arena PvE
        </Link>
      </div>
    </div>
  );
};

export default Home;
