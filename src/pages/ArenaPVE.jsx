import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";
import { getRandomAIAction, applyAIAction } from "../gameLogic/pve/pveLogic";
import { GameState } from "../gameLogic/GameState";
import { TurnManager } from "../gameLogic/TurnManager";
import HealthBar from "../components/ui/HealthBar";

const ArenaPVE = () => {
  const [playerAddress, setPlayerAddress] = useState(null);
  const [playerHP, setPlayerHP] = useState(100);
  const [aiHP, setAIHP] = useState(100);
  const [gameState, setGameState] = useState(GameState.WaitingForAction);
  const [turn, setTurn] = useState("player"); // "player" or "ai"
  const [statusMessage, setStatusMessage] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  // Setup wallet and contract
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const newSigner = await newProvider.getSigner();
        const newContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, newSigner);
        const address = await newSigner.getAddress();

        setProvider(newProvider);
        setSigner(newSigner);
        setContract(newContract);
        setPlayerAddress(address);
        setStatusMessage("Game ready! Your turn.");
      }
    };
    init();
  }, []);

  const handlePlayerAction = async (action) => {
    if (gameState !== GameState.WaitingForAction || turn !== "player") return;

    setGameState(GameState.Resolving);
    let newAIHP = aiHP;

    if (action === "attack") {
      newAIHP = Math.max(aiHP - 10, 0);
      setStatusMessage("You attacked the monster!");
    } else if (action === "heal") {
      const healed = Math.min(playerHP + 10, 100);
      setPlayerHP(healed);
      setStatusMessage("You healed yourself!");
    } else if (action === "defend") {
      setStatusMessage("You defend!");
    }

    setAIHP(newAIHP);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (newAIHP <= 0) {
      setGameState(GameState.Finished);
      setStatusMessage("You defeated the monster!");
      return;
    }

    setTurn("ai");
    setGameState(GameState.WaitingForAction);

    // AI turn
    setTimeout(() => {
      const aiAction = getRandomAIAction();
      const { newPlayerHP } = applyAIAction({ aiAction, playerHP, aiHP: newAIHP });

      setPlayerHP(newPlayerHP);
      if (aiAction === "attack") {
        setStatusMessage("Monster attacks you!");
      } else if (aiAction === "heal") {
        const healedAI = Math.min(newAIHP + 10, 100);
        setAIHP(healedAI);
        setStatusMessage("Monster heals itself!");
      } else {
        setStatusMessage("Monster defends!");
      }

      if (newPlayerHP <= 0) {
        setGameState(GameState.Finished);
        setStatusMessage("You were defeated!");
      } else {
        setTurn("player");
        setGameState(GameState.WaitingForAction);
      }
    }, 1000);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-4">Arena PvE</h1>

      <div className="mb-4">
        <HealthBar label="Your HP" hp={playerHP} />
        <HealthBar label="Monster HP" hp={aiHP} />
      </div>

      <div className="text-center text-lg font-semibold mb-4">
        {statusMessage}
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => handlePlayerAction("attack")}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={turn !== "player" || gameState !== GameState.WaitingForAction}
        >
          Attack
        </button>
        <button
          onClick={() => handlePlayerAction("defend")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={turn !== "player" || gameState !== GameState.WaitingForAction}
        >
          Defend
        </button>
        <button
          onClick={() => handlePlayerAction("heal")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={turn !== "player" || gameState !== GameState.WaitingForAction}
        >
          Heal
        </button>
      </div>
    </div>
  );
};

export default ArenaPVE;
