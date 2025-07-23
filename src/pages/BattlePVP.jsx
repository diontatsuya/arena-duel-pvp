import { useEffect, useState } from "react";
import { ACTIONS } from "../utils/constants";

const BattlePVP = ({ contract, signer }) => {
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [status, setStatus] = useState("Memuat...");
  const [lastAction, setLastAction] = useState(null);
  const [actionPending, setActionPending] = useState(false);

  const fetchStatus = async () => {
    const address = await signer.getAddress();
    const playerData = await contract.players(address);
    if (playerData.opponent === "0x0000000000000000000000000000000000000000") {
      setStatus("Menunggu lawan...");
      return;
    }

    const opponentData = await contract.players(playerData.opponent);
    setPlayer({ ...playerData, address });
    setOpponent({ ...opponentData, address: playerData.opponent });
    setIsPlayerTurn(playerData.isTurn);
    setLastAction(playerData.lastAction.toString());
    setStatus("Bertarung!");
  };

  useEffect(() => {
    if (!contract || !signer) return;
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [contract, signer]);

  const performAction = async (action) => {
    try {
      setActionPending(true);
      const tx = await contract.takeAction(action);
      await tx.wait();
      await fetchStatus();
    } catch (err) {
      console.error(err);
    } finally {
      setActionPending(false);
    }
  };

  const renderActionButton = (label, actionValue) => (
    <button
      disabled={!isPlayerTurn || actionPending}
      onClick={() => performAction(actionValue)}
      className={`px-4 py-2 rounded font-bold mx-2 ${
        isPlayerTurn
          ? "bg-green-600 hover:bg-green-700"
          : "bg-gray-500 cursor-not-allowed"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-bold mb-4">Pertarungan PvP</h2>
      <p>Status: {status}</p>
      {player && opponent && (
        <div className="mt-6 grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-lg">Kamu</h3>
            <p>HP: {player.hp.toString()}</p>
            <p>Aksi Terakhir: {ACTIONS[lastAction] ?? "None"}</p>
          </div>
          <div>
            <h3 className="font-bold text-lg">Lawan</h3>
            <p>HP: {opponent.hp.toString()}</p>
            <p>Aksi Terakhir: {ACTIONS[opponent.lastAction.toString()] ?? "None"}</p>
          </div>
        </div>
      )}
      <div className="mt-6">
        <h3 className="mb-2">Aksi:</h3>
        {renderActionButton("Attack", 1)}
        {renderActionButton("Defend", 2)}
        {renderActionButton("Heal", 3)}
      </div>
    </div>
  );
};

export default BattlePVP;
