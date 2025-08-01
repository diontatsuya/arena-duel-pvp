import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectWallet } from "../utils/connectWallet";
import { checkBattleStatus } from "../gameLogic/pvp/checkBattleStatus";

const ArenaPVP = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [battleId, setBattleId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConnectWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await connectWallet();
      if (result) {
        setWalletAddress(result.account);
        setSigner(result.signer);
      } else {
        setError("Gagal menghubungkan wallet.");
      }
    } catch (err) {
      console.error("Gagal koneksi wallet:", err);
      setError("Gagal koneksi wallet. Pastikan jaringan Somnia dan MetaMask aktif.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBattleStatus = async () => {
    if (!walletAddress || !signer) return;
    setLoading(true);
    try {
      const currentBattleId = await checkBattleStatus(walletAddress, signer);
      if (currentBattleId) {
        setBattleId(currentBattleId);
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

  useEffect(() => {
    handleConnectWallet();
  }, []);

  useEffect(() => {
    if (walletAddress && signer) {
      fetchBattleStatus();
    }
  }, [walletAddress, signer]);

  const handleJoinClick = () => {
    navigate("/join-pvp");
  };

  const handleBattleClick = () => {
    if (battleId) {
      navigate(`/arena-battle/${battleId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-black text-white p-6">
      <h1 className="text-4xl font-extrabold mb-6 tracking-wide">Arena PvP</h1>

      <div className="mb-4 text-lg text-center">
        {loading && <p className="text-blue-400">🔄 Memuat data...</p>}
        {error && !loading && <p className="text-red-400">❌ {error}</p>}
        {!walletAddress && !error && !loading && (
          <p className="text-yellow-400">🔌 Status: Wallet belum terhubung</p>
        )}
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
        {!loading && !walletAddress && (
          <button
            onClick={handleConnectWallet}
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
