import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { checkBattleStatus } from "../gameLogic/pvp/checkBattleStatus";
import { useJoinMatchmaking } from "../gameLogic/pvp/JoinMatchMaking";
import { useLeaveMatchmaking } from "../gameLogic/pvp/LeaveMatchMaking";
import WaitingMatch from "../components/pvp/WaitingMatch";

const JoinPVP = () => {
  const navigate = useNavigate();
  const { walletAddress, signer } = useWallet();
  const [isWaiting, setIsWaiting] = useState(false);

  const { joinMatchmaking } = useJoinMatchmaking();
  const { leaveMatchmaking } = useLeaveMatchmaking();

  // Cek apakah user sedang dalam battle
  useEffect(() => {
    if (!walletAddress || !signer) return;

    const checkBattle = async () => {
      try {
        const battle = await checkBattleStatus(walletAddress, signer);
        console.log("Hasil checkBattleStatus:", battle);

        if (battle && battle !== "0") {
          navigate(`/ArenaBattle/${battle}`);
        }
      } catch (error) {
        console.error("Error saat checkBattle:", error);
      }
    };

    checkBattle();
  }, [walletAddress, signer, navigate]);

  const handleJoin = async () => {
    if (!walletAddress) {
      alert("Wallet belum terhubung.");
      return;
    }

    try {
      const success = await joinMatchmaking();
      if (success) {
        setIsWaiting(true);
      } else {
        alert("Gagal masuk matchmaking.");
      }
    } catch (error) {
      console.error("Gagal join matchmaking:", error);
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
