import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";
import { useWallet } from "../context/WalletContext";
import { checkBattleStatus } from "../gameLogic/pvp/checkBattleStatus";

const ArenaPVP = () => {
  const navigate = useNavigate();
  const { walletAddress, signer, loading } = useWallet();
  const [existingBattleId, setExistingBattleId] = useState(null);
  const [checkingBattle, setCheckingBattle] = useState(true);

  useEffect(() => {
    const checkExistingBattle = async () => {
      if (!walletAddress || !signer) return;

      try {
        setCheckingBattle(true);
        const battleId = await checkBattleStatus(walletAddress, signer);
        console.log("Battle ID ditemukan:", battleId);
        if (battleId !== null && battleId !== undefined && battleId !== 0) {
          setExistingBattleId(battleId.toString());
        } else {
          setExistingBattleId(null);
        }
      } catch (error) {
        console.error("Gagal memeriksa status battle:", error);
        setExistingBattleId(null);
      } finally {
        setCheckingBattle(false);
      }
    };

    checkExistingBattle();
  }, [walletAddress, signer]);

  const handleJoinBattle = () => {
    navigate("/join-pvp");
  };

  const handleContinueBattle = () => {
    if (existingBattleId) {
      console.log("Navigating to battle ID:", existingBattleId);
      navigate(`/arena-battle/${existingBattleId}`);
    } else {
      console.warn("Tidak ada Battle ID yang bisa dilanjutkan");
    }
  };

  if (loading || checkingBattle) {
    return (
      <div className="text-white text-center mt-10">
        <p>Loading wallet dan status battle...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-black px-4">
      <h1 className="text-3xl font-bold mb-6">Arena PVP</h1>

      {existingBattleId ? (
        <>
          <p className="mb-4">
            Kamu memiliki battle yang sedang berlangsung! ID: {existingBattleId}
          </p>
          <button
            onClick={handleContinueBattle}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
          >
            Lanjutkan Battle
          </button>
        </>
      ) : (
        <>
          <p className="mb-4">Belum ada battle aktif. Ayo mulai!</p>
          <button
            onClick={handleJoinBattle}
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
