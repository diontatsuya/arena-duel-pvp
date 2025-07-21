// src/pages/ArenaPVE.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";
import HealthBar from "../components/ui/HealthBar";
import ActionButtons from "../components/ui/ActionButtons";

const ArenaPVE = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [playerHP, setPlayerHP] = useState(100);
  const [aiHP, setAiHP] = useState(100);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [lastAction, setLastAction] = useState("");

  // Connect wallet and setup provider
  useEffect(() => {
    const connect = async () => {
      if (window.ethereum) {
        const tempProvider = new ethers.BrowserProvider(window.ethereum);
        const tempSigner = await tempProvider.getSigner();
        const tempContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, tempSigner);

        setProvider(tempProvider);
        setSigner(tempSigner);
        setContract(tempContract);
      }
    };

    connect();
  }, []);

  // AI Turn (simple logic)
  useEffect(() => {
    if (!isPlayerTurn && !gameOver) {
      setTimeout(() => {
        const action = ["attack", "defend", "heal"][Math.floor(Math.random() * 3)];
        handleAction(action, false);
      }, 1000);
    }
  }, [isPlayerTurn]);

  const handleAction = (action, isPlayer = true) => {
    if (gameOver) return;

    if (action === "attack") {
      if (isPlayer) {
        const damage = Math.floor(Math.random() * 21) + 10;
        const newHP = Math.max(aiHP - damage, 0);
        setAiHP(newHP);
        setLastAction(`You attacked AI for ${damage} damage!`);
        if (newHP === 0) setGameOver(true);
      } else {
        const damage = Math.floor(Math.random() * 21) + 10;
        const newHP = Math.max(playerHP - damage, 0);
        setPlayerHP(newHP);
        setLastAction(`AI attacked you for ${damage} damage!`);
        if (newHP === 0) setGameOver(true);
      }
    }

    if (action === "defend") {
      setLastAction(isPlayer ? "You defended!" : "AI defended!");
    }

    if (action === "heal") {
      const healAmount = Math.floor(Math.random() * 11) + 10;
      if (isPlayer) {
        const newHP = Math.min(playerHP + healAmount, 100);
        setPlayerHP(newHP);
        setLastAction(`You healed for ${healAmount} HP!`);
      } else {
        const newHP = Math.min(aiHP + healAmount, 100);
        setAiHP(newHP);
        setLastAction(`AI healed for ${healAmount} HP!`);
      }
    }

    setIsPlayerTurn(!isPlayer);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Arena PvE (Player vs AI)</h1>
      <div className="grid grid-cols-2 gap-8 w-full max-w-xl">
        <div className="text-center">
          <p className="font-semibold mb-2">You</p>
          <HealthBar hp={playerHP} />
        </div>
        <div className="text-center">
          <p className="font-semibold mb-2">AI</p>
          <HealthBar hp={aiHP} />
        </div>
      </div>

      {!gameOver ? (
        <div className="mt-6">
          {isPlayerTurn ? (
            <ActionButtons onAction={(action) => handleAction(action)} />
          ) : (
            <p>AI's turn...</p>
          )}
        </div>
      ) : (
        <div className="mt-6 font-bold text-xl">
          {playerHP === 0 ? "You lost!" : "You won!"}
        </div>
      )}

      <p className="mt-4 italic">{lastAction}</p>
    </div>
  );
};

export default ArenaPVE;
