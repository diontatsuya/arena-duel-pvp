// src/components/GameArena.jsx
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/contractABI";
import { ACTIONS } from "../utils/constants";

const GameArena = ({ walletAddress, signer }) => {
  const [playerData, setPlayerData] = useState(null);
  const [opponentData, setOpponentData] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  const fetchPlayerStates = async () => {
    const player = await contract.players(walletAddress);
    const opponent = await contract.players(player.opponent);

    setPlayerData(player);
    setOpponentData(opponent);
    setIsPlayerTurn(player.isTurn);
  };

  const handleAction = async (action) => {
    if (!isPlayerTurn) return alert("Bukan giliranmu!");

    try {
      const tx = await contract.takeAction(action);
      setStatusMessage("Mengirim aksi...");
      await tx.wait();
      setStatusMessage("Aksi berhasil!");
      fetchPlayerStates();
    } catch (error) {
      console.error("Gagal mengirim aksi:", error);
      setStatusMessage("Gagal mengirim aksi.");
    }
  };

  useEffect(() => {
    if (!walletAddress) return;

    fetchPlayerStates();

    const interval = setInterval(() => {
      fetchPlayerStates();
    }, 4000); // polling tiap 4 detik

    return () => clearInterval(interval);
  }, [walletAddress]);

  if (!playerData || !opponentData) return <p>Memuat data duel...</p>;

  return (
    <div className="text-white bg-gray-800 rounded-xl p-6 w-full max-w-xl mx-auto shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Arena Duel PvP</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700 p-4 rounded-xl">
          <h3 className="text-lg font-semibold">Kamu</h3>
          <p>HP: {playerData.hp.toString()}</p>
          <p>Giliranmu: {isPlayerTurn ? "✅" : "❌"}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-xl">
          <h3 className="text-lg font-semibold">Lawan</h3>
          <p>HP: {opponentData.hp.toString()}</p>
          <p>Giliranmu: {opponentData.isTurn ? "✅" : "❌"}</p>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => handleAction(ACTIONS.ATTACK)}
          disabled={!isPlayerTurn}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
        >
          Attack
        </button>
        <button
          onClick={() => handleAction(ACTIONS.DEFEND)}
          disabled={!isPlayerTurn}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Defend
        </button>
        <button
          onClick={() => handleAction(ACTIONS.HEAL)}
          disabled={!isPlayerTurn}
          className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Heal
        </button>
      </div>

      {statusMessage && (
        <p className="mt-4 text-center text-yellow-300">{statusMessage}</p>
      )}
    </div>
  );
};

export default GameArena;
