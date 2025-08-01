import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";
import { connectWalletAndCheckNetwork } from "../utils/connectWallet";
import BattleStatus from "../components/pvp/BattleStatus";
import BattleControls from "../components/pvp/BattleControls";

const SOMNIA_CHAIN_ID = 50312;

const ArenaBattle = () => {
  const { battleId } = useParams();
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState(null);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    try {
      const address = await connectWalletAndCheckNetwork(SOMNIA_CHAIN_ID);
      if (address) setWalletAddress(address);
    } catch (err) {
      setError("Gagal koneksi wallet.");
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Arena Battle ID #{battleId}</h1>

      {error && <p className="text-red-500 mb-4">❌ {error}</p>}

      {walletAddress ? (
        <>
          <BattleStatus battleId={battleId} walletAddress={walletAddress} />
          <BattleControls battleId={battleId} walletAddress={walletAddress} />
        </>
      ) : (
        <p className="text-yellow-400">🔌 Silakan hubungkan wallet untuk melanjutkan.</p>
      )}

      <button
        onClick={() => navigate("/arena-pvp")}
        className="mt-6 bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded"
      >
        🔙 Kembali ke Arena PvP
      </button>
    </div>
  );
};

export default ArenaBattle;
