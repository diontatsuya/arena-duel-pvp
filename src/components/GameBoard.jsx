// src/components/GameBoard.jsx

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { contractAddress, contractABI } from '../utils/contractABI';
import { ACTIONS } from '../utils/constants';

const GameBoard = ({ provider, signer, playerAddress }) => {
  const [contract, setContract] = useState(null);
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [isTurn, setIsTurn] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (signer) {
      const gameContract = new ethers.Contract(contractAddress, contractABI, signer);
      setContract(gameContract);

      // Event listener
      gameContract.on("ActionTaken", (playerAddr, action, playerHp, opponentHp) => {
        setLogs(prev => [
          `🎮 ${ACTIONS[action]} digunakan oleh ${playerAddr.slice(0, 6)}... → HP: ${playerHp}/${opponentHp}`,
          ...prev,
        ]);
        fetchGameState(gameContract);
      });

      return () => {
        gameContract.removeAllListeners("ActionTaken");
      };
    }
  }, [signer]);

  const fetchGameState = async (gameContract) => {
    try {
      const p = await gameContract.players(playerAddress);
      const o = await gameContract.players(p.opponent);
      setPlayer(p);
      setOpponent(o);
      setIsTurn(p.isTurn);
    } catch (err) {
      console.error("Error fetching state:", err);
    }
  };

  const handleAction = async (action) => {
    if (!contract || !isTurn) return;
    try {
      setLoading(true);
      const tx = await contract.takeAction(action);
      await tx.wait();
      setLoading(false);
    } catch (err) {
      console.error("Action failed:", err);
      setLoading(false);
    }
  };

  if (!player) {
    return (
      <div className="text-center mt-10">
        <p className="text-lg">⏳ Menunggu lawan untuk matchmaking...</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold mb-4">🔥 Arena Duel</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-semibold">👤 Kamu</h3>
          <p>HP: {player.hp?.toString()}</p>
          <p>Aksi terakhir: {ACTIONS[player.lastAction]}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-semibold">🧿 Lawan</h3>
          <p>HP: {opponent?.hp?.toString() || '-'}</p>
          <p>Aksi terakhir: {ACTIONS[opponent?.lastAction] || '-'}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-lg font-medium">{isTurn ? "🎯 Giliran Kamu!" : "⏱️ Menunggu lawan..."}</p>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        {Object.keys(ACTIONS).filter(a => a !== "0").map(key => (
          <button
            key={key}
            onClick={() => handleAction(parseInt(key))}
            disabled={!isTurn || loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {ACTIONS[key]}
          </button>
        ))}
      </div>

      <div className="text-left max-w-xl mx-auto">
        <h4 className="font-semibold mb-2">📜 Log Aksi:</h4>
        <ul className="text-sm space-y-1">
          {logs.map((log, idx) => <li key={idx}>- {log}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default GameBoard;
