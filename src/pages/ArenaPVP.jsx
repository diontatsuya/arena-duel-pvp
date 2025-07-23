import { Link } from "react-router-dom";

const ArenaPVP = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-white bg-gray-900">
      <h1 className="text-4xl font-bold mb-6">Arena PvP</h1>
      <p className="mb-4">Status: Belum terhubung</p>
      <Link to="/join-pvp">
        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition">
          Gabung PvP
        </button>
      </Link>

      <div className="mt-8 w-full max-w-md bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Kamu</h2>
        <p className="text-gray-400">Belum bergabung</p>

        <h2 className="text-xl font-semibold mt-4 mb-2">Lawan</h2>
        <p className="text-gray-400">-</p>
      </div>
    </div>
  );
};

export default ArenaPVP;
