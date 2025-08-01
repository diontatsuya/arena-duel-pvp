import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";
import { connectWalletAndCheckNetwork } from "../utils/connectWallet";

const SOMNIA_CHAIN_ID = 50312;

const ArenaPVP = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState(null);
  const [battleId, setBattleId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fungsi koneksi wallet
  const connectWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      const address = await connectWalletAndCheckNetwork(SOMNIA_CHAIN_ID);
      if (address) {
        setWalletAddress(address);
      }
    } catch (err) {
      console.error("Gagal koneksi wallet:", err);
      setError("Gagal koneksi wallet. Pastikan jaringan Somnia dan MetaMask aktif.");
    } finally {
      setLoading(false);
    }
  };

  // Cek apakah player sedang dalam battle
  const checkBattleStatus = async () => {
    if (!walletAddress || typeof window.ethereum === "undefined") return;

    setLoading(true);
    setError(null);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      const currentBattleId = await contract.playerToBattleId(walletAddress);
      if (currentBattleId && currentBattleId.gt(0)) {
        setBattleId(currentBattleId.toString());
      } else {
        setBattleId(null);
      }
    } catch (err) {
      console.error("Gagal cek status battle:", err);
      setError("Gagal cek status battle.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClick = () => {
    navigate("/join-pvp");
  };

  const handleBattleClick = () => {
    if (battleId) {
      navigate(`/arena-battle/${battleId}`);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (walletAddress) {
      checkBattleStatus();
    }
  }, [walletAddress]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-black text-white p-6">
      <h1 className="text-4xl font-extrabold mb-6 tracking-wide">Arena PvP</h1>

      <div className="mb-4 text-lg text-center">
        {error && <p className="text-red-400">❌ {error}</p>}
        {!walletAddress && !error && <p>🔌 Status: Belum terhubung wallet</p>}
        {walletAddress && loading && <p>⏳ Mengecek status battle...</p>}
        {walletAddress && !loading && !error && (
          <p>
            🧙 Status:{" "}
            {battleId ? (
              <span className="text-green-400">Sedang dalam pertarungan</span>
            ) : (
              <span className="text-yellow-400">Belum ada battle aktif</span>
            )}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {!loading && walletAddress && !battleId && (
          <button
            onClick={handleJoinClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition"
          >
            ⚔️ Gabung PvP
          </button>
        )}
        {!loading && walletAddress && battleId && (
          <button
            onClick={handleBattleClick}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition"
          >
            🎮 Lanjutkan Battle
          </button>
        )}
        {!walletAddress && (
          <button
            onClick={connectWallet}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition"
          >
            🔌 Hubungkan Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default ArenaPVP;
