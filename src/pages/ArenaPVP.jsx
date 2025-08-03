import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectWallet } from "../utils/connectWallet";
import { checkBattleStatus } from "../gameLogic/pvp/checkBattleStatus";

const ArenaPVP = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState(null);
  const [inBattle, setInBattle] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleWalletConnect = async () => {
    const connection = await connectWallet();
    if (connection && connection.account) {
      setWalletAddress(connection.account);
    } else {
      console.warn("Wallet tidak terhubung");
      setWalletAddress(null);
    }
  };

  const handleCheckBattleStatus = async (account) => {
    try {
      const result = await checkBattleStatus(account);
      setInBattle(result);
    } catch (error) {
      console.error("Gagal memeriksa status battle:", error);
      setInBattle(false);
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
    if (walletAddress) {
      navigate(`/arena-battle/${walletAddress}`);
    } else {
      alert("Wallet belum terhubung.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-lg">Memuat status battle...</div>;
  }

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-3xl font-bold mb-6">Arena PvP</h1>

      {walletAddress ? (
        <>
          <p className="mb-4 text-lg">Wallet: {walletAddress}</p>
          {inBattle ? (
            <button
              onClick={handleResumeBattle}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Lanjutkan Battle
            </button>
          ) : (
            <p className="text-yellow-600">Kamu belum dalam pertarungan.</p>
          )}
        </>
      ) : (
        <p className="text-red-600">Wallet belum terhubung. Silakan login dari navbar.</p>
      )}
    </div>
  );
};

export default ArenaPVP;
