import { useEffect, useState } from "react";
import { useWallet } from "../components/ui/WalletStatus";
import { Link } from "react-router-dom";

const Home = () => {
  const { account, signature } = useWallet();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (account && signature) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [account, signature]);

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
      <h1 className="text-4xl font-bold mb-4 text-yellow-400 drop-shadow-lg">Arena Duel Turn-Based</h1>
      <p className="text-lg mb-6 text-gray-300">
        Masuki arena dan tantang lawanmu dalam duel bergiliran. Pilih aksi dengan strategi!
      </p>

      {!isLoggedIn ? (
        <p className="text-red-400">Silakan login terlebih dahulu dengan MetaMask untuk memulai permainan.</p>
      ) : (
        <div className="space-x-4">
          <Link to="/arena-pvp">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-2xl shadow-md">
              Arena PvP
            </button>
          </Link>
          <Link to="/arena-pve">
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-2xl shadow-md">
              Arena PvE
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
