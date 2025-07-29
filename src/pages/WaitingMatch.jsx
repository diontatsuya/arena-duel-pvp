import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const WaitingMatch = ({ walletAddress }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!walletAddress) return;

    const checkMatchStatus = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
        const playerData = await contract.getPlayer(walletAddress);

        if (playerData.inBattle) {
          navigate("/arena-pvp/battle");
        }
      } catch (error) {
        console.error("Error checking match status:", error);
      }
    };

    const interval = setInterval(checkMatchStatus, 3000);

    return () => clearInterval(interval);
  }, [walletAddress, navigate]);

  return (
    <div className="text-center mt-12">
      <h2 className="text-2xl font-bold mb-4">Menunggu Lawan PvP...</h2>
      <p className="text-gray-400">Kami sedang mencarikan lawan untukmu...</p>
    </div>
  );
};

export default WaitingMatch;
