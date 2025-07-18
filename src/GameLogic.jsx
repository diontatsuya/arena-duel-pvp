import { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "./utils/contractABI.json";

const CONTRACT_ADDRESS = "0x95dd66c55214a3d603fe1657e22f710692fcbd9b"; // Ganti sesuai kebutuhan

export default function useGameLogic(signer) {
  const [playerHP, setPlayerHP] = useState(100);
  const [opponentHP, setOpponentHP] = useState(100);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [battleLog, setBattleLog] = useState([]);
  const [isDebugVisible, setIsDebugVisible] = useState(false);

  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (!signer) return;
    const instance = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    setContract(instance);
    loadGameState(instance);
  }, [signer]);

  async function loadGameState(instance) {
    try {
      const address = await signer.getAddress();
      const player = await instance.players(address);
      const opponent = await instance.players(player.opponent);

      setPlayerHP(player.hp.toNumber());
      setOpponentHP(opponent.hp.toNumber());
      setIsMyTurn(player.isTurn);
      setIsDebugVisible(false);
    } catch (err) {
      console.error("loadGameState error:", err);
      // fallback to debug mode if not matched
      setIsDebugVisible(true);
    }
  }

  function addLog(message) {
    setBattleLog((prev) => [...prev, message]);
  }

  async function handleAction(action) {
    if (!contract) return;

    try {
      const tx = await contract.takeTurn(actionToEnum(action));
      addLog(`You used ${action}. Waiting for transaction...`);
      await tx.wait();
      addLog(`You used ${action}.`);
      await loadGameState(contract);
    } catch (err) {
      console.error(err);
      addLog("Action failed. See console.");
    }
  }

  function actionToEnum(action) {
    if (action === "attack") return 1;
    if (action === "defend") return 2;
    if (action === "heal") return 3;
    return 0;
  }

  // Debug logic (offline simulation)
  function simulateDebugAction(action) {
    let newPlayerHP = playerHP;
    let newOpponentHP = opponentHP;

    if (action === "attack") {
      newOpponentHP = Math.max(0, opponentHP - 20);
      addLog("You attacked. Opponent HP -20.");
    } else if (action === "defend") {
      addLog("You defended.");
    } else if (action === "heal") {
      newPlayerHP = Math.min(100, playerHP + 15);
      addLog("You healed. +15 HP.");
    }

    setPlayerHP(newPlayerHP);
    setOpponentHP(newOpponentHP);
    setIsMyTurn(false);
    setTimeout(() => simulateOpponentTurn(), 2000);
  }

  function simulateOpponentTurn() {
    const actions = ["attack", "defend", "heal"];
    const random = actions[Math.floor(Math.random() * actions.length)];

    let newPlayerHP = playerHP;

    if (random === "attack") {
      newPlayerHP = Math.max(0, playerHP - 15);
      addLog("Opponent attacked. Your HP -15.");
    } else if (random === "defend") {
      addLog("Opponent defended.");
    } else if (random === "heal") {
      setOpponentHP((prev) => Math.min(100, prev + 10));
      addLog("Opponent healed. +10 HP.");
    }

    setPlayerHP(newPlayerHP);
    setIsMyTurn(true);
  }

  return {
    playerHP,
    opponentHP,
    isMyTurn,
    battleLog,
    onAction: isDebugVisible ? simulateDebugAction : handleAction,
    isDebugVisible,
    onDebug: () => simulateDebugAction("attack"),
  };
}
