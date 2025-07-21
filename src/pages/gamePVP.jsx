import { useEffect, useState } from "react";
import { getContract, getPlayerStatus, performAction } from "../gameLogic/pvpLogic";

const GamePVP = () => {
  const [contract, setContract] = useState(null);
  const [player, setPlayer] = useState({});
  const [opponent, setOpponent] = useState({});
  const [status, setStatus] = useState("Loading...");
  const [txHash, setTxHash] = useState("");

  const ACTIONS = ["Attack", "Defend", "Heal"];

  const fetchStatus = async () => {
    if (!contract || !window.ethereum) return;
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const playerAddress = accounts[0];
    const playerData = await getPlayerStatus(contract, playerAddress);
    const opponentData = playerData?.opponent !== ethers.ZeroAddress
      ? await getPlayerStatus(contract, playerData.opponent)
      : {};
    setPlayer(playerData);
    setOpponent(opponentData);
    setStatus(playerData?.isTurn ? "Your Turn!" : "Waiting for Opponent...");
  };

  const handleAction = async (index) => {
    setStatus("Processing...");
    const hash = await performAction(contract, index);
    setTxHash(hash);
    setStatus("Action sent!");
    setTimeout(fetchStatus, 3000);
  };

  useEffect(() => {
    const init = async () => {
      const c = await getContract();
      setContract(c);
    };
    init();
  }, []);

  useEffect(() => {
    if (contract) fetchStatus();
  }, [contract]);

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl mb-4 font-bold">⚔️ Arena Duel PvP</h2>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 p-4 rounded-xl shadow">
          <h3 className="text-xl mb-2">🧍 You</h3>
          <p>HP: {player?.hp ?? "?"}</p>
          <p>Action: {ACTIONS[player?.lastAction] || "-"}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl shadow">
          <h3 className="text-xl mb-2">🧟 Opponent</h3>
          <p>HP: {opponent?.hp ?? "?"}</p>
          <p>Action: {ACTIONS[opponent?.lastAction] || "-"}</p>
        </div>
      </div>

      <p className="mb-4">{status}</p>

      {player?.isTurn && (
        <div className="flex justify-center gap-4 mb-4">
          {ACTIONS.map((label, idx) => (
            <button
              key={idx}
              onClick={() => handleAction(idx + 1)}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {txHash && (
        <p className="text-sm text-green-400">
          Tx: <a href={`https://testnet.somniaexplorer.xyz/tx/${txHash}`} target="_blank" rel="noreferrer">{txHash.slice(0, 10)}...</a>
        </p>
      )}
    </div>
  );
};

export default GamePVP;
