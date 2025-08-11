import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { ethers } from "ethers";
import { checkBattleStatus } from "../gameLogic/pvp/checkBattleStatus";
import { getBattle } from "../gameLogic/pvp/getBattle";
import { useJoinMatchmaking } from "../gameLogic/pvp/JoinMatchMaking";
import { useLeaveMatchmaking } from "../gameLogic/pvp/LeaveMatchMaking";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";
import WaitingMatch from "../components/pvp/WaitingMatch"; // pastikan ada komponen ini

const JoinPVP = () => {
  const navigate = useNavigate();
  const { walletAddress, signer } = useWallet();
  const [isWaiting, setIsWaiting] = useState(false);
  const [battleId, setBattleId] = useState("0");

  const { joinMatchmaking } = useJoinMatchmaking();
  const { leaveMatchmaking } = useLeaveMatchmaking();
  const zeroAddr = ethers.constants.AddressZero.toLowerCase();

  useEffect(() => {
    if (!walletAddress || !signer) return;

    const checkStatus = async () => {
      try {
        const battleId = await checkBattleStatus(walletAddress, signer);
        if (battleId && battleId !== "0") {
          setBattleId(battleId);
          return;
        }

        const currentBattle = await getBattle(signer, battleId);
        const isMatchmaking =
          currentBattle?.status === 0 &&
          currentBattle?.player2 === zeroAddr;

        if (isMatchmaking) {
          setIsWaiting(true);
        }
      } catch (error) {
        console.error("Gagal cek status matchmaking/battle:", error);
      }
    };

    checkStatus();
  }, [walletAddress, signer, battleId]);

  // Polling saat sedang menunggu
  useEffect(() => {
    let interval;
    if (isWaiting) {
      interval = setInterval(async () => {
        const matched = await checkBattleStatus(walletAddress, signer);
        if (matched) {
          setBattleId(matched);
          navigate(`/arena-battle`); // Navigasi tanpa battleId di URL
          clearInterval(interval);
        }
      }, 3000);

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
        navigate(`/arena-battle`); // Navigasi tanpa battleId di URL
        return;
      }

      const currentBattle = await getBattle(signer, battleId);
      if (currentBattle?.status === 0 && currentBattle?.player2 === zeroAddr) {
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

  // Fungsi baru untuk keluar dari battle aktif
  const leaveBattle = async () => {
    if (!walletAddress || !signer) return false;

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const activeId = await contract.activeBattleId(walletAddress);
      if (activeId.toString() === "0") {
        alert("Kamu tidak sedang dalam battle aktif.");
        return false;
      }

      const tx = await contract.leaveBattle();
      await tx.wait();
      return true;
    } catch (error) {
      console.error("Gagal keluar dari battle:", error);
      return false;
    }
  };

  const handleLeave = async () => {
    if (!walletAddress || !signer) return;

    try {
      const currentBattle = await getBattle(signer, battleId);
      const isCurrentlyMatchmaking =
        currentBattle?.status === 0 && currentBattle?.player2 === zeroAddr;

      if (isCurrentlyMatchmaking) {
        const success = await leaveMatchmaking();
        if (success) {
          alert("Berhasil keluar dari matchmaking.");
          setIsWaiting(false);
          setBattleId("0");
        } else {
          alert("Gagal keluar dari matchmaking.");
        }
      } else {
        // Keluar dari battle aktif
        const success = await leaveBattle();
        if (success) {
          alert("Berhasil keluar dari battle aktif.");
          setBattleId("0");
          navigate("/arena-pvp");
        } else {
          alert("Gagal keluar dari battle aktif.");
        }
      }
    } catch (error) {
      console.error("Gagal keluar:", error);
      alert("Terjadi kesalahan saat mencoba keluar.");
    }
  };

  const handleContinueBattle = () => {
    if (battleId && battleId !== "0") {
      navigate(`/arena-battle`); // Navigasi tanpa battleId di URL
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
