import { useEffect, useState } from "react";
import { ethers } from "ethers";
import HealthBar from "./HealthBar";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      const _provider = new ethers.BrowserProvider(window.ethereum);
      await _provider.send("eth_requestAccounts", []);
      const _signer = await _provider.getSigner();
      const _account = await _signer.getAddress();
      const _contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, _signer);

      setProvider(_provider);
      setSigner(_signer);
      setAccount(_account);
      setContract(_contract);
    } else {
      alert("Please install MetaMask to play!");
    }
  };

  const getStatus = async () => {
    if (!contract || !account) return;
    try {
      const playerData = await contract.players(account);
      const opponentData = await contract.players(playerData.opponent);

      setPlayer({
        hp: Number(playerData.hp),
        isTurn: playerData.isTurn,
        lastAction: Number(playerData.lastAction),
      });

      setOpponent({
        hp: Number(opponentData.hp),
        lastAction: Number(opponentData.lastAction),
      });
    } catch (error) {
      console.error("Failed to get status:", error);
    }
  };

  const performAction = async (action) => {
    if (!contract || !account) return;
    setLoading(true);
    setTxStatus("Sending transaction...");

    try {
      const tx = await contract.takeAction(action);
      await tx.wait();
      setTxStatus("Action completed!");
      await getStatus();
    } catch (err) {
      console.error("Transaction failed:", err);
      setTxStatus("Action failed or rejected.");
    }

    setLoading(false);
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (contract && account) {
      getStatus();
    }
  }, [contract, account]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">🔥 PvP Battle</h1>
      <p className="mb-2">Connected as: {account}</p>

      {player && opponent ? (
        <div className="w-full max-w-xl grid grid-cols-2 gap-4 items-center mb-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-1">You</h2>
            <HealthBar hp={player.hp} />
            <p className="mt-2">
              Last Action: {["None", "Attack", "Defend", "Heal"][player.lastAction]}
            </p>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-1">Opponent</h2>
            <HealthBar hp={opponent.hp} />
            <p className="mt-2">
              Last Action: {["None", "Attack", "Defend", "Heal"][opponent.lastAction]}
            </p>
          </div>
        </div>
      ) : (
        <p>Waiting for matchmaking...</p>
      )}

      {player?.isTurn ? (
        <div className="flex gap-4 mb-4">
          <button
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
            onClick={() => performAction(1)}
            disabled={loading}
          >
            Attack
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
            onClick={() => performAction(2)}
            disabled={loading}
          >
            Defend
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
            onClick={() => performAction(3)}
            disabled={loading}
          >
            Heal
          </button>
        </div>
      ) : (
        <p className="mb-4">⏳ Waiting for opponent's turn...</p>
      )}

      {txStatus && <p className="text-sm text-gray-300 italic">{txStatus}</p>}
    </div>
  );
};

export default ArenaPVP;
