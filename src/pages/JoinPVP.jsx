import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { checkBattleStatus } from "../gameLogic/pvp/checkBattleStatus";
import { getBattle } from "../gameLogic/pvp/getBattle";
import { useJoinMatchmaking } from "../gameLogic/pvp/JoinMatchMaking";
import { useLeaveMatchmaking } from "../gameLogic/pvp/LeaveMatchMaking";
import WaitingMatch from "../components/pvp/WaitingMatch";

const JoinPVP = () => {
  const navigate = useNavigate();
  const { walletAddress, signer } = useWallet();
  const [isWaiting, setIsWaiting] = useState(false);
  const [battleId, setBattleId] = useState("0");

  const { joinMatchmaking } = useJoinMatchmaking();
  const { leaveMatchmaking } = useLeaveMatchmaking();

  useEffect(() => {
    if (!walletAddress || !signer) return;

    const checkBattle = async () => {
      try {
        const battleId = await checkBattleStatus(walletAddress, signer);
        console.log("Hasil checkBattleStatus:", battleId);

        if (battleId && battleId !== "0") {
          setBattleId(battleId); // simpan battleId di state
        }
      } catch (error) {
        console.error("Error saat checkBattle:", error);
      }
    };

    checkBattle();
  }, [walletAddress, signer]);

  const handleJoin = async () => {
    if (!walletAddress || !signer) {
      alert("Wallet belum terhubung.");
      return;
    }

    try {
      // 1. Cek apakah sudah ada battle aktif
      const battleId = await checkBattleStatus(walletAddress, signer);
      if (battleId && battleId !== "0") {
        console.log("Sudah ada battle aktif, masuk ke ArenaBattle...");
        navigate(`/arena-battle/${battleId}`);
        return;
      }

      // 2. Cek apakah sedang dalam matchmaking
      const currentBattle = await getBattle(signer, walletAddress);
      if (
        currentBattle?.status === 0 &&
        currentBattle?.player2?.address === "0x0000000000000000000000000000000000000000"
      ) {
        console.log("Sedang dalam matchmaking, redirect ke waiting...");
        setIsWaiting(true);
        return;
      }

      // 3. Join matchmaking
      const success = await joinMatchmaking();
      if (success) {
        setIsWaiting(true);
      } else {
        alert("Gagal masuk matchmaking.");
      }
    } catch (error) {
      console.error("Gagal join matchmaking:", error);
      alert("Terjadi kesalahan saat mencoba join matchmaking.");
    }
  };

  const handleLeave = async () => {
    if (!walletAddress) return;

    try {
      await leaveMatchmaking();
      setIsWaiting(false);
    } catch (error) {
      console.error("Gagal keluar dari matchmaking:", error);
    }
  };

  const handleContinueBattle = () => {
    navigate(`/arena-battle/${battleId}`);
  };

  if (isWaiting) {
    return (
      <WaitingMatch
        playerAddress={walletAddress}
        onCancel={handleLeave}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold mb-4">Arena PVP</h1>
      <p className="mb-6">Cari lawan untuk bertarung di Arena!</p>

      {battleId !== "0" && (
        <button
          onClick={handleContinueBattle}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full mb-4"
        >
          Lanjutkan Battle
        </button>
      )}

      <button
        onClick={handleJoin}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full"
      >
        Cari Lawan
      </button>
    </div>
  );
};

export default JoinPVP;
