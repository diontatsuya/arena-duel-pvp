import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import BattleStatus from "../components/pvp/BattleStatus";
import BattleControls from "../components/pvp/BattleControls";
import { connectWallet } from "../utils/connectWallet";
import { getBattle } from "../gameLogic/pvp/getBattle";

const ArenaBattle = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [battleData, setBattleData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBattleData = async (wallet, provider) => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
      const battle = await getBattle(contract, wallet);
      setBattleData(battle);
    } catch (err) {
      console.error("Gagal memuat data battle:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const init = async () => {
    const { wallet, signer, provider } = await connectWallet();
    if (!wallet) {
      alert("Gagal menghubungkan wallet");
      return navigate("/");
    }
    setWalletAddress(wallet);
    setSigner(signer);
    await fetchBattleData(wallet, provider);
  };

  useEffect(() => {
    init();
  }, []);

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

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Arena Battle</h2>

      {/* Status Pertarungan */}
      <BattleStatus battleData={battleData} walletAddress={walletAddress} />

      {/* Kontrol Pertarungan */}
      <BattleControls
        signer={signer}
        walletAddress={walletAddress}
        battleData={battleData}
        refreshBattleData={() => fetchBattleData(walletAddress, signer.provider)}
      />

      {/* Tombol Keluar Battle */}
      <button
        onClick={async () => {
          try {
            if (!signer) return alert("Wallet belum terhubung");

            const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
            const tx = await contract.leaveBattle(); // ✅ TANPA ARGUMEN SESUAI ABI
            await tx.wait();

            alert("Berhasil keluar dari battle");
            navigate("/arena-pvp");
          } catch (err) {
            console.error("Gagal keluar dari battle:", err);
            alert("Gagal keluar dari battle");
          }
        }}
        className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
      >
        ❌ Tinggalkan Battle
      </button>
    </div>
  );
};

export default ArenaBattle;
