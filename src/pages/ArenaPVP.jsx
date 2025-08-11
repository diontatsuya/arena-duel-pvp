import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { checkBattleStatus } from "../gameLogic/pvp/checkBattleStatus";

const ArenaPVP = () => {
  const navigate = useNavigate();
  const { walletAddress, signer, loading } = useWallet();
  const [hasActiveBattle, setHasActiveBattle] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const fetchBattleStatus = async () => {
      if (!walletAddress || !signer) {
        setHasActiveBattle(false);
        setChecking(false);
        return;
      }

      try {
        setChecking(true);
        const battleId = await checkBattleStatus(walletAddress, signer);

        setHasActiveBattle(battleId !== null);
      } catch (err) {
        console.error("Gagal memeriksa status battle:", err);
        setHasActiveBattle(false);
      } finally {
        setChecking(false);
      }
    };

    fetchBattleStatus();
    // Jangan masukkan hasActiveBattle atau lainnya supaya tidak loop
  }, [walletAddress, signer]);

  const handleJoin = () => {
    navigate("/join-pvp");
  };

  const handleContinue = () => {
    navigate("/arena-battle");
  };

  if (loading || checking) {
    return (
      <div className="text-white text-center mt-10">
        <p>Memuat wallet dan status battle...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-black px-4">
      <h1 className="text-3xl font-bold mb-6">Arena PVP</h1>

      {hasActiveBattle ? (
        <>
          <p className="mb-4">Kamu memiliki battle yang sedang berlangsung!</p>
          <button
            onClick={handleContinue}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
          >
            Lanjutkan Battle
          </button>
        </>
      ) : (
        <>
          <p className="mb-4">Belum ada battle aktif. Ayo mulai pertarungan!</p>
          <button
            onClick={handleJoin}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Join PVP
          </button>
        </>
      )}
    </div>
  );
};

export default ArenaPVP;
