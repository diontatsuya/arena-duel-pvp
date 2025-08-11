import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import BattleStatus from "../components/pvp/BattleStatus";
import BattleControls from "../components/pvp/BattleControls";
import { useWallet } from "../context/WalletContext";
import { handleAction } from "../gameLogic/pvp/handleAction";

const ArenaBattle = () => {
  const navigate = useNavigate();
  const { walletAddress, signer, isConnected } = useWallet();

  const [battleData, setBattleData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const fetchMyBattle = async () => {
      if (!signer || !walletAddress) {
        navigate("/arena-pvp");
        return;
      }
      try {
        setIsLoading(true);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
        const battle = await contract.getMyBattle();

        // Contoh cek properti isActive, sesuaikan jika struktur berbeda
        if (battle && battle.isActive) {
          setBattleData(battle);
        } else {
          setBattleData(null);
          navigate("/arena-pvp");
        }
      } catch (error) {
        console.error("Gagal memuat battle aktif:", error);
        setBattleData(null);
        navigate("/arena-pvp");
      } finally {
        setIsLoading(false);
      }
    };

    if (isConnected) {
      fetchMyBattle();
    } else {
      navigate("/arena-pvp");
    }
  }, [signer, walletAddress, isConnected, navigate]);

  const handleLeaveBattle = async () => {
    if (!signer) return;

    try {
      setLeaving(true);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.leaveBattle();
      await tx.wait();
      alert("Berhasil keluar dari battle.");
      navigate("/arena-pvp");
    } catch (err) {
      console.error("Gagal keluar dari battle:", err);
      alert("Gagal keluar dari battle.");
    } finally {
      setLeaving(false);
    }
  };

  const onAction = async (actionType) => {
    if (!signer) return;
    await handleAction(actionType, signer, async () => {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const updatedBattle = await contract.getMyBattle();
      setBattleData(updatedBattle);
    });
  };

  if (isLoading) {
    return <div className="p-4 text-white">Memuat battle aktif...</div>;
  }

  if (!battleData) {
    return (
      <div className="p-4 text-white">
        <p>Belum ada battle aktif.</p>
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
        refreshBattleData={async () => {
          const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
          const updatedBattle = await contract.getMyBattle();
          setBattleData(updatedBattle);
        }}
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
