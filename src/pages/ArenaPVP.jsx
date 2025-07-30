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

  const connectWallet = async () => {
    const address = await connectWalletAndCheckNetwork(SOMNIA_CHAIN_ID);
    if (address) {
      setWalletAddress(address);
    }
  };

  const checkBattleStatus = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      const currentBattleId = await contract.playerToBattleId(walletAddress);

      if (currentBattleId.toString() !== "0") {
        setBattleId(currentBattleId.toString());
      }
    } catch (error) {
      console.error("Gagal mengecek status battle:", error);
    }
  };

  const handleJoinClick = () => {
    navigate("/join-pvp");
  };

  const handleBattleClick = () => {
    navigate(`/arena-battle/${battleId}`);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-6">Arena PvP</h1>
      <div className="mb-4">
        <p>Status: {walletAddress ? (battleId ? "Sedang bertanding" : "Menunggu lawan...") : "Belum terhubung"}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        {!battleId && (
          <button
            onClick={handleJoinClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md"
          >
            Gabung PvP
          </button>
        )}
        {battleId && (
          <button
            onClick={handleBattleClick}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md"
          >
            Lanjutkan Battle
          </button>
        )}
      </div>
    </div>
  );
};

export default ArenaPVP;
