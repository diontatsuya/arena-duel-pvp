import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";
import { connectWalletAndCheckNetwork } from "../utils/connectWallet";

const JoinPVP = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    try {
      const connection = await connectWalletAndCheckNetwork();
      if (connection) {
        setWalletAddress(connection.account);
        setSigner(connection.signer);
      }
    } catch (err) {
      setError("Gagal hubungkan wallet. Pastikan jaringan Somnia.");
    }
  };

  const joinMatchmaking = async () => {
    if (!walletAddress || !signer) return;
    setLoading(true);
    setError(null);
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.joinMatchmaking();
      await tx.wait();

      const battleId = await contract.playerToBattleId(walletAddress);
      navigate(`/arena-battle/${battleId}`);
    } catch (err) {
      console.error("Join matchmaking error:", err);
      setError("Gagal join matchmaking.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Gabung Arena PvP</h1>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {walletAddress ? (
        <button
          onClick={joinMatchmaking}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md"
        >
          {loading ? "⏳ Bergabung..." : "⚔️ Join PvP"}
        </button>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg shadow-md"
        >
          🔌 Hubungkan Wallet
        </button>
      )}
    </div>
  );
};

export default JoinPVP;
