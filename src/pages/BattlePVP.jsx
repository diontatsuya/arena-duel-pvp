import { useEffect, useState } from "react";
import { ethers } from "ethers";

const BattlePVP = ({ contract, signer }) => {
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [turn, setTurn] = useState(false);
  const [status, setStatus] = useState("");
  const [lastAction, setLastAction] = useState("");

  const fetchGameState = async () => {
    const account = await signer.getAddress();
    const playerData = await contract.players(account);
    const opponentData = await contract.players(playerData.opponent);

    setPlayer({
      hp: playerData.hp.toNumber(),
      lastAction: playerData.lastAction,
    });
    setOpponent({
      hp: opponentData.hp.toNumber(),
      lastAction: opponentData.lastAction,
    });
    setTurn(playerData.isTurn);
  };

  useEffect(() => {
    fetchGameState();
  }, []);

  const doAction = async (actionType) => {
    try {
      setStatus(`Melakukan aksi ${actionType}...`);
      let tx;
      if (actionType === "attack") {
        tx = await contract.attack();
      } else if (actionType === "defend") {
        tx = await contract.defend();
      } else if (actionType === "heal") {
        tx = await contract.heal();
      }
      await tx.wait();
      setStatus("Aksi selesai!");
      fetchGameState();
    } catch (err) {
      console.error(err);
      setStatus("Gagal melakukan aksi.");
    }
  };

  if (!player || !opponent) return <p className="text-center mt-10">Memuat data game...</p>;

  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-bold mb-4">Arena PvP: Pertarungan Berlangsung</h2>
      <div className="mb-4">
        <p className="text-lg">Kamu (HP: {player.hp})</p>
        <p className="text-sm text-gray-400">Aksi terakhir: {player.lastAction}</p>
      </div>
      <div className="mb-4">
        <p className="text-lg">Lawan (HP: {opponent.hp})</p>
        <p className="text-sm text-gray-400">Aksi terakhir: {opponent.lastAction}</p>
      </div>
      <p className="mb-2 font-bold">
        {turn ? "Giliran kamu!" : "Menunggu giliran lawan..."}
      </p>
      {turn && (
        <div className="space-x-2">
          <button
            onClick={() => doAction("attack")}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
          >
            Serang
          </button>
          <button
            onClick={() => doAction("defend")}
            className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-white"
          >
            Bertahan
          </button>
          <button
            onClick={() => doAction("heal")}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
          >
            Pulihkan
          </button>
        </div>
      )}
      <p className="mt-4">{status}</p>
    </div>
  );
};

export default BattlePVP;
