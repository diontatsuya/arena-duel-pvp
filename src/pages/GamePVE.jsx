// src/pages/GamePVE.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { getRandomAIAction, resolveTurn } from "../gameLogic/pveLogic";
import HealthBar from "../components/ui/HealthBar";

const GamePVE = () => {
  const [playerHP, setPlayerHP] = useState(100);
  const [aiHP, setAIHP] = useState(100);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Game started!");

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const connect = async () => {
      if (window.ethereum) {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        const _signer = await _provider.getSigner();
        const _contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, _signer);
        setProvider(_provider);
        setSigner(_signer);
        setContract(_contract);
      }
    };
    connect();
  }, []);

  const handleAction = async (playerAction) => {
    if (!isPlayerTurn || playerHP <= 0 || aiHP <= 0) return;

    const aiAction = getRandomAIAction();
    const result = resolveTurn(playerAction, aiAction, playerHP, aiHP);

    setPlayerHP(result.newPlayerHP);
    setAIHP(result.newAIHP);
    setStatusMessage(result.message);
    setIsPlayerTurn(false);

    setTimeout(() => {
      setIsPlayerTurn(true);
      setStatusMessage("Your turn!");
    }, 2000);
  };

  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4">Arena Duel: Player vs AI</h2>
      <div className="flex justify-around mb-6">
        <div>
          <h3 className="mb-1">Your HP</h3>
          <HealthBar hp={playerHP} />
        </div>
        <div>
          <h3 className="mb-1">AI HP</h3>
          <HealthBar hp={aiHP} />
        </div>
      </div>

      <p className="mb-4 text-yellow-400">{statusMessage}</p>

      <div className="flex justify-center space-x-4">
        <button
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          onClick={() => handleAction("attack")}
          disabled={!isPlayerTurn}
        >
          Attack
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          onClick={() => handleAction("defend")}
          disabled={!isPlayerTurn}
        >
          Defend
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          onClick={() => handleAction("heal")}
          disabled={!isPlayerTurn}
        >
          Heal
        </button>
      </div>
    </div>
  );
};

export default GamePVE;
