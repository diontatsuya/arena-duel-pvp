import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { checkBattleStatus } from "../gameLogic/pvp/checkBattleStatus";

const ArenaPVP = () => {
  const navigate = useNavigate();
  const { walletAddress, signer, loading } = useWallet();
  const [battleId, setBattleId] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const fetchBattleStatus = async () => {
      if (!walletAddress || !signer) return;

      try {
        setChecking(true);
        const id = await checkBattleStatus(walletAddress, signer);

        if (id && Number(id) > 0) {
          console.log("Battle ID ditemukan:", id);
          setBattleId(id);
        } else {
          setBattleId(null);
        }
      } catch (err) {
        console.error("Gagal memeriksa status battle:", err);
        setBattleId(null);
      } finally {
        setChecking(false);
      }
    };

    fetchBattleStatus();
  }, [walletAddress, signer]);

  const handleJoin = () => {
    navigate("/join-pvp");
  };

  const handleContinue = () => {
    if (battleId) {
      navigate("/arena-battle");
    }
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

      {battleId ? (
        <>
          <p className="mb-4">
            Kamu memiliki battle yang sedang berlangsung! ID:{" "}
            <span className="font-mono text-yellow-400">{battleId}</span>
          </p>
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
