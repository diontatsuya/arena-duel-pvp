import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectWallet } from "../utils/connectWallet";
import { checkBattleStatus } from "../gameLogic/pvp/checkBattleStatus";

const ArenaPVP = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState(null);
  const [battleId, setBattleId] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleWalletConnect = async () => {
    try {
      const result = await connectWallet();
      if (result && result.account) {
        setWalletAddress(result.account);
      }
    } catch (err) {
      console.error("Gagal menghubungkan wallet:", err);
    }
  };

  const handleCheckBattleStatus = async (account) => {
    try {
      const result = await checkBattleStatus(account);
      // Jika result berisi battleId (angka), set ke state
      if (result && typeof result === "number") {
        setBattleId(result);
      } else {
        setBattleId(null);
      }
    } catch (err) {
      console.error("Gagal cek status battle:", err);
      setBattleId(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await handleWalletConnect();
    };
    init();
  }, []);

  useEffect(() => {
    if (walletAddress) {
      handleCheckBattleStatus(walletAddress);
    }
  }, [walletAddress]);

  const handleResumeBattle = () => {
    if (battleId !== null) {
      navigate(`/arena-battle/${battleId}`);
    }
  };

  return (
    <div className="flex flex-col items-center mt-20 text-white">
      <h1 className="text-3xl font-bold mb-6">Arena PvP</h1>

      {loading ? (
        <p>Memuat status battle...</p>
      ) : (
        <>
          {walletAddress ? (
            <>
              <p className="mb-4">Wallet: {walletAddress}</p>
              {battleId !== null ? (
                <button
                  onClick={handleResumeBattle}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  🎮 Lanjutkan Battle #{battleId}
                </button>
              ) : (
                <p className="text-yellow-400">Kamu belum dalam pertarungan.</p>
              )}
            </>
          ) : (
            <p className="text-red-400">Wallet belum terhubung.</p>
          )}
        </>
      )}
    </div>
  );
};

export default ArenaPVP;
