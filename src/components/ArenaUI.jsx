import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { performAction } from "../utils/GameLogic";
import contractABI from "../utils/contractABI.json";

const CONTRACT_ADDRESS = "0x95dd66c55214a3d603fe1657e22f710692fcbd9b";

const ArenaUI = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [message, setMessage] = useState("");

  // Inisialisasi wallet dan kontrak
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        await newProvider.send("eth_requestAccounts", []);
        const newSigner = newProvider.getSigner();
        const account = await newSigner.getAddress();

        const newContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI,
          newSigner
        );

        setProvider(newProvider);
        setSigner(newSigner);
        setCurrentAccount(account);
        setContract(newContract);
      } else {
        setMessage("Please install MetaMask.");
      }
    };
    init();
  }, []);

  // Ambil data player dan lawan
  useEffect(() => {
    const fetchStatus = async () => {
      if (contract && currentAccount) {
        const playerData = await contract.players(currentAccount);
        const opponentData = await contract.players(playerData.opponent);

        setPlayer(playerData);
        setOpponent(opponentData);
      }
    };
    fetchStatus();
  }, [contract, currentAccount]);

  const handleAction = async (action) => {
    if (!contract || !signer) return;

    setMessage(`Performing action: ${action}...`);
    try {
      const tx = await performAction(contract, action);
      await tx.wait();
      setMessage(`Action ${action} completed!`);

      // Refresh status setelah aksi
      const playerData = await contract.players(currentAccount);
      const opponentData = await contract.players(playerData.opponent);
      setPlayer(playerData);
      setOpponent(opponentData);
    } catch (err) {
      console.error(err);
      setMessage("Action failed.");
    }
  };

  const renderHealth = (hp) => {
    const percent = Math.max(0, Math.min(100, (hp / 100) * 100));
    return (
      <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden mb-1">
        <div
          className="bg-red-500 h-full"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-800 to-black text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Arena Duel - Turn-Based</h1>

      <div className="w-full max-w-xl bg-gray-900 p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">You</h2>
        {player ? (
          <>
            {renderHealth(player.hp)}
            <p>HP: {player.hp?.toString()}</p>
            <p>Last Action: {Object.keys(player.lastAction || {}).length > 0 ? player.lastAction : "None"}</p>
            <p>Your Turn: {player.isTurn ? "Yes" : "No"}</p>
          </>
        ) : (
          <p>Loading player data...</p>
        )}
      </div>

      <div className="w-full max-w-xl bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Opponent</h2>
        {opponent ? (
          <>
            {renderHealth(opponent.hp)}
            <p>HP: {opponent.hp?.toString()}</p>
            <p>Last Action: {Object.keys(opponent.lastAction || {}).length > 0 ? opponent.lastAction : "None"}</p>
          </>
        ) : (
          <p>No opponent yet. Waiting for match...</p>
        )}
      </div>

      {player?.isTurn ? (
        <div className="flex gap-4 mb-4">
          <button
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
            onClick={() => handleAction("attack")}
          >
            Attack
          </button>
          <button
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => handleAction("defend")}
          >
            Defend
          </button>
          <button
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            onClick={() => handleAction("heal")}
          >
            Heal
          </button>
        </div>
      ) : (
        <p className="mb-4">Waiting for opponent's turn...</p>
      )}

      <p className="text-yellow-400 mt-2">{message}</p>
    </div>
  );
};

export default ArenaUI;
