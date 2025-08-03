import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";
import { connectWallet } from "../utils/connectWallet";
import { checkBattleStatus } from "../gameLogic/pvp/checkBattleStatus";

const ArenaPVP = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState(null);
  const [status, setStatus] = useState("Memeriksa status...");
  const [battleId, setBattleId] = useState(null);
  const [error, setError] = useState("");

  // Koneksi wallet saat halaman dibuka
  useEffect(() => {
    const initWallet = async () => {
      const { walletAddress, signer } = await connectWallet();
      if (walletAddress && signer) {
        setWalletAddress(walletAddress);
        setSigner(signer);
      } else {
        setError("Gagal menghubungkan wallet.");
      }
    };
    initWallet();
  }, []);

  // Cek status battle saat wallet sudah siap
  useEffect(() => {
    const checkStatus = async () => {
      if (!walletAddress || !signer) return;

      const activeBattleId = await checkBattleStatus(walletAddress, signer);
      if (activeBattleId) {
        setStatus("Sedang dalam pertarungan");
        setBattleId(activeBattleId);
      } else {
        setStatus("Belum bergabung dalam pertarungan");
        setBattleId(null);
      }
    };
    checkStatus();
  }, [walletAddress, signer]);

  const handleContinueBattle = () => {
    if (!walletAddress || !signer || !battleId) {
      alert("Gagal melanjutkan. Wallet belum terhubung atau tidak ada battle.");
      return;
    }
    navigate(`/arena-battle/${battleId}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Arena PVP</h2>

      {error && (
        <div className="text-red-600 font-semibold mb-2">{error}</div>
      )}

      <p className="mb-4">Status: {status}</p>

      {battleId && (
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleContinueBattle}
        >
          Lanjutkan Battle
        </button>
      )}

      {!battleId && (
        <p className="text-gray-600">
          Silakan bergabung dalam pertarungan dari halaman Join PVP.
        </p>
      )}
    </div>
  );
};

export default ArenaPVP;
