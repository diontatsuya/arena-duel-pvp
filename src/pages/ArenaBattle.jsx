import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import BattleStatus from "../components/pvp/BattleStatus";
import BattleControls from "../components/pvp/BattleControls";
import { getBattle } from "../gameLogic/pvp/getBattle";
import { useWallet } from "../context/WalletContext";

const ArenaBattle = () => {
  const { id } = useParams();
  console.log("ID dari URL:", id);
  const navigate = useNavigate();
  const { walletAddress, signer, provider, isConnected } = useWallet();
  const [battleData, setBattleData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBattleData = async () => {
    try {
      if (!walletAddress || !provider) return;

      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
      const battle = await getBattle(contract, walletAddress);
      setBattleData(battle);
    } catch (err) {
      console.error("Gagal memuat data battle:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isConnected) {
      navigate("/arena-pvp");
      return;
    }

    fetchBattleData();
  }, [walletAddress, provider, isConnected, navigate]);

  if (isLoading) return <div className="p-4">Memuat battle...</div>;

  if (!battleData || !battleData.exists) {
    return (
      <div className="p-4">
        <p>Kamu belum berada di dalam battle.</p>
        <button
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          onClick={() => navigate("/arena-pvp")}
        >
          🔙 Kembali ke Arena
        </button>
      </div>
    );
  }

  const handleLeaveBattle = async () => {
    try {
      if (!signer) {
        alert("Wallet belum terhubung");
        return;
      }

      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.leaveBattle();
      await tx.wait();

      alert("Berhasil keluar dari battle");
      navigate("/arena-pvp");
    } catch (err) {
      console.error("Gagal keluar dari battle:", err);
      alert("Gagal keluar dari battle");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Arena Battle</h2>

      <BattleStatus battleData={battleData} walletAddress={walletAddress} />

      <BattleControls
        signer={signer}
        walletAddress={walletAddress}
        battleData={battleData}
        refreshBattleData={fetchBattleData}
      />

      <button
        onClick={handleLeaveBattle}
        className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
      >
        ❌ Tinggalkan Battle
      </button>
    </div>
  );
};

export default ArenaBattle;
