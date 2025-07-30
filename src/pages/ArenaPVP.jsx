import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";
import { connectWalletAndCheckNetwork } from "../utils/connectWallet";
import WaitingMatch from "../components/pvp/WaitingMatch";

const SOMNIA_CHAIN_ID = 50312;

const ArenaPVP = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState(null);
  const [battleId, setBattleId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cek wallet saat pertama kali masuk halaman
  useEffect(() => {
    const checkWallet = async () => {
      const address = await connectWalletAndCheckNetwork(SOMNIA_CHAIN_ID);
      if (address) {
        setWalletAddress(address);
      }
    };
    checkWallet();
  }, []);

  // Cek apakah sudah ada battle aktif
  useEffect(() => {
    const checkBattleStatus = async () => {
      if (!walletAddress) {
        setLoading(false);
        return;
      }

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

        const player = await contract.players(walletAddress);
        const currentBattleId = player.battleId.toString();

        if (currentBattleId !== "0") {
          setBattleId(currentBattleId);
        }
      } catch (error) {
        console.error("Gagal mengecek status battle:", error);
      }

      setLoading(false);
    };

    checkBattleStatus();
  }, [walletAddress]);

  const handleJoin = () => {
    navigate("/join-pvp");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p>Memuat status pemain...</p>
      </div>
    );
  }

  if (!walletAddress) {
    return (
      <div className="text-center py-10">
        <p className="text-lg">Hubungkan wallet terlebih dahulu.</p>
      </div>
    );
  }

  if (battleId) {
    return <WaitingMatch playerAddress={walletAddress} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-3xl font-bold mb-6">Arena PvP</h2>
      <p className="mb-4">Status: Belum berada dalam battle.</p>
      <button
        onClick={handleJoin}
        className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold transition"
      >
        Gabung PvP
      </button>
    </div>
  );
};

export default ArenaPVP;
