import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import BattleStatus from "../components/pvp/BattleStatus";
import BattleControls from "../components/pvp/BattleControls";
import { getBattle } from "../gameLogic/pvp/getBattle";
import { useWallet } from "../context/WalletContext";
import { handleAction } from "../gameLogic/pvp/handleAction";

const ArenaBattle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { walletAddress, signer, isConnected } = useWallet();

  const [battleData, setBattleData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [leaving, setLeaving] = useState(false);

  const fetchBattleData = useCallback(async () => {
    if (!id || !signer) return;

    try {
      setIsLoading(true);
      const battle = await getBattle(signer, id);
      setBattleData(battle);
    } catch (err) {
      console.error("❌ Gagal memuat data battle:", err);
    } finally {
      setIsLoading(false);
    }
  }, [id, signer]);

  useEffect(() => {
    if (!isConnected || !id) {
      navigate("/arena-pvp");
      return;
    }

    fetchBattleData();
  }, [isConnected, id, fetchBattleData, navigate]);

  const handleLeaveBattle = async () => {
    if (!signer || !walletAddress) return;

    try {
      setLeaving(true);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      const activeId = await contract.activeBattleId(walletAddress);
      if (activeId.toString() !== id) {
        alert("Kamu tidak tergabung dalam battle ini.");
        return;
      }

      const tx = await contract.leaveBattle();
      await tx.wait();

      alert("Berhasil keluar dari battle.");
      navigate("/arena-pvp");
    } catch (err) {
      console.error("❌ Gagal keluar dari battle:", err);
      alert("Gagal keluar dari battle.");
    } finally {
      setLeaving(false);
    }
  };

  const onAction = async (actionType) => {
    if (!signer) return;
    await handleAction(actionType, signer, fetchBattleData);
  };

  if (isLoading) {
    return <div className="p-4 text-white">Memuat battle...</div>;
  }

  if (!battleData) {
    return (
      <div className="p-4 text-white">
        <p>Battle tidak ditemukan atau kamu tidak tergabung dalam battle ini.</p>
        <button
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          onClick={() => navigate("/arena-pvp")}
        >
          🔙 Kembali ke Arena
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl font-bold mb-4">Arena Battle</h2>

      <BattleStatus battleData={battleData} walletAddress={walletAddress} />

      <BattleControls
        signer={signer}
        walletAddress={walletAddress}
        battleData={battleData}
        refreshBattleData={fetchBattleData}
        onAction={onAction}
      />

      <button
        onClick={handleLeaveBattle}
        disabled={leaving}
        className={`mt-4 py-2 px-4 rounded text-white ${
          leaving ? "bg-gray-500 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
        }`}
      >
        ❌ {leaving ? "Keluar..." : "Tinggalkan Battle"}
      </button>
    </div>
  );
};

export default ArenaBattle;
