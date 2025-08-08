import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { checkBattleStatus } from "../gameLogic/pvp/checkBattleStatus";
import { getBattle } from "../gameLogic/pvp/getBattle";
import { useJoinMatchmaking } from "../gameLogic/pvp/JoinMatchMaking";
import { useLeaveMatchmaking } from "../gameLogic/pvp/LeaveMatchMaking";
import WaitingMatch from "../components/pvp/WaitingMatch";
import { checkIfMatched } from "../gameLogic/pvp/checkIfMatched";

const JoinPVP = () => {
  const navigate = useNavigate();
  const { walletAddress, signer } = useWallet();
  const [isWaiting, setIsWaiting] = useState(false);
  const [battleId, setBattleId] = useState("0");

  const { joinMatchmaking } = useJoinMatchmaking();
  const { leaveMatchmaking } = useLeaveMatchmaking();

  useEffect(() => {
    if (!walletAddress || !signer) return;

    const checkStatus = async () => {
      try {
        const battleId = await checkBattleStatus(walletAddress, signer);
        console.log("Hasil checkBattleStatus:", battleId);

        if (battleId && battleId !== "0") {
          setBattleId(battleId);
          return;
        }

        const currentBattle = await getBattle(signer);
        const isMatchmaking =
          currentBattle?.status === 0 &&
          currentBattle?.player2?.address === "0x0000000000000000000000000000000000000000";

        if (isMatchmaking) {
          console.log("Sedang dalam matchmaking...");
          setIsWaiting(true);
        }
      } catch (error) {
        console.error("Gagal cek status matchmaking/battle:", error);
      }
    };

    checkStatus();
  }, [walletAddress, signer]);

  // Polling saat sedang menunggu
  useEffect(() => {
    let interval;
    if (isWaiting) {
      interval = setInterval(async () => {
        const matched = await checkIfMatched(walletAddress);
        if (matched) {
          const battleId = await checkBattleStatus(walletAddress, signer);
          if (battleId) {
            navigate(`/arena-battle/${battleId}`);
            clearInterval(interval);
          }
        }
      }, 3000); // Polling setiap 3 detik

      return () => clearInterval(interval);
    }
  }, [isWaiting, walletAddress, signer, navigate]);

  const handleJoin = async () => {
    if (!walletAddress || !signer) {
      alert("Wallet belum terhubung.");
      return;
    }

    try {
      const battleId = await checkBattleStatus(walletAddress, signer);
      if (battleId && battleId !== "0") {
        console.log("Sudah ada battle aktif, masuk ke ArenaBattle...");
        navigate(`/arena-battle/${battleId}`);
        return;
      }

      const currentBattle = await getBattle(signer);
      if (
        currentBattle?.status === 0 &&
        currentBattle?.player2?.address === "0x0000000000000000000000000000000000000000"
      ) {
        console.log("Sedang dalam matchmaking, redirect ke waiting...");
        setIsWaiting(true);
        return;
      }

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
  if (!walletAddress || !signer) return;

  try {
    // Cek status battle
    const battleId = await checkBattleStatus(walletAddress, signer);
    const currentBattle = await getBattle(signer);

    const isCurrentlyMatchmaking =
      currentBattle?.status === 0 &&
      currentBattle?.player2?.address === "0x0000000000000000000000000000000000000000";

    if (!isCurrentlyMatchmaking) {
      alert("Kamu tidak sedang dalam matchmaking.");
      return;
    }

    // Jika memang sedang matchmaking, lanjut leave
    const success = await leaveMatchmaking();
    if (success) {
      alert("Berhasil keluar dari matchmaking.");
      setIsWaiting(false);
      setBattleId("0");
    } else {
      alert("Gagal keluar dari matchmaking.");
    }
  } catch (error) {
    console.error("Gagal keluar dari matchmaking:", error);
    alert("Terjadi kesalahan saat mencoba keluar dari matchmaking.");
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
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full mb-2"
      >
        Cari Lawan
      </button>

      {(battleId !== "0" || isWaiting) && (
        <button
          onClick={handleLeave}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full"
        >
          Tinggalkan Pertandingan
        </button>
      )}
    </div>
  );
};

export default JoinPVP;
