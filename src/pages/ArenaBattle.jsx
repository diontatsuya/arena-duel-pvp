import React, { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";
import { useNavigate } from "react-router-dom";

const ACTIONS = {
  ATTACK: 0,
  DEFEND: 1,
  HEAL: 2,
};

const ArenaBattle = () => {
  const { signer, walletAddress } = useWallet();
  const [battle, setBattle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [txInProgress, setTxInProgress] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchBattle = async () => {
    if (!signer) return;
    try {
      setLoading(true);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const battleData = await contract.getMyBattle();
      if (!battleData.isActive) {
        alert("Tidak ada battle aktif. Kembali ke Arena PVP.");
        navigate("/arena-pvp");
        return;
      }
      setBattle(battleData);
    } catch (err) {
      console.error("Gagal ambil data battle:", err);
      alert("Gagal ambil data battle");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBattle();

    if (!signer) return;

    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

    // Event listener untuk update setelah aksi diambil
    const onActionTaken = (battleId, player, action, playerHP, opponentHP, isNextPlayer1Turn) => {
      setMessage(`Player ${player} melakukan aksi ${["Attack", "Defend", "Heal"][action]}`);
      fetchBattle();
    };

    // Event listener battle selesai
    const onBattleEnded = (battleId, winner, loser) => {
      setMessage(`Battle selesai! Pemenang: ${winner}`);
      fetchBattle();
    };

    contract.on("ActionTaken", onActionTaken);
    contract.on("BattleEnded", onBattleEnded);

    return () => {
      contract.off("ActionTaken", onActionTaken);
      contract.off("BattleEnded", onBattleEnded);
    };
  }, [signer]);

  const isPlayer1 = battle?.player1?.toLowerCase() === walletAddress?.toLowerCase();
  const isPlayerTurn = battle?.isPlayer1Turn === isPlayer1;
  const playerHP = isPlayer1 ? battle?.player1HP?.toNumber() : battle?.player2HP?.toNumber();
  const opponentHP = isPlayer1 ? battle?.player2HP?.toNumber() : battle?.player1HP?.toNumber();

  const handleAction = async (action) => {
    if (!signer || !battle) return;
    if (!isPlayerTurn) {
      alert("Bukan giliranmu!");
      return;
    }
    try {
      setTxInProgress(true);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.takeAction(action);
      await tx.wait();
      setMessage("Aksi berhasil dikirim!");
      fetchBattle();
    } catch (err) {
      console.error("Gagal kirim aksi:", err);
      alert("Gagal kirim aksi");
    } finally {
      setTxInProgress(false);
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-10">Loading battle data...</div>;
  }

  if (!battle || !battle.isActive) {
    return (
      <div className="text-white text-center mt-10">
        <p>Tidak ada battle aktif. Kembali ke Arena PVP.</p>
        <button
          className="bg-blue-600 px-4 py-2 rounded mt-4"
          onClick={() => navigate("/arena-pvp")}
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <h1 className="text-3xl font-bold mb-6">Arena Battle</h1>

      <div className="mb-4">
        <p>HP Kamu: {playerHP}</p>
        <p>HP Lawan: {opponentHP}</p>
        <p>{isPlayerTurn ? "Giliranmu!" : "Giliran lawan..."}</p>
      </div>

      <div className="flex space-x-4 mb-4">
        <button
          disabled={!isPlayerTurn || txInProgress}
          onClick={() => handleAction(ACTIONS.ATTACK)}
          className="bg-red-600 px-4 py-2 rounded disabled:opacity-50"
        >
          Attack
        </button>
        <button
          disabled={!isPlayerTurn || txInProgress}
          onClick={() => handleAction(ACTIONS.DEFEND)}
          className="bg-yellow-600 px-4 py-2 rounded disabled:opacity-50"
        >
          Defend
        </button>
        <button
          disabled={!isPlayerTurn || txInProgress}
          onClick={() => handleAction(ACTIONS.HEAL)}
          className="bg-green-600 px-4 py-2 rounded disabled:opacity-50"
        >
          Heal
        </button>
      </div>

      {message && <p className="mb-4">{message}</p>}

      <button
        onClick={() => navigate("/arena-pvp")}
        className="bg-gray-600 px-4 py-2 rounded"
      >
        Kembali ke Arena PVP
      </button>
    </div>
  );
};

export default ArenaBattle;
