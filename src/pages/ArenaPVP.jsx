// src/pages/ArenaPVP.jsx
import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";
import { connectWalletAndCheckNetwork } from "../utils/connectWallet";
import { getPVPGameState, handlePVPAction } from "../logic/pvp/gameLogic";
import { ActionButtons } from "../components/ui/ActionButtons";
import HealthBar from "../components/ui/HealthBar";
import "../styles/Game.css";


const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  const [status, setStatus] = useState(null);
  const [opponentStatus, setOpponentStatus] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  // 🔌 Hubungkan Wallet
  useEffect(() => {
    const init = async () => {
      try {
        const { provider, signer, account } = await connectWalletAndCheckNetwork();
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
        setProvider(provider);
        setSigner(signer);
        setAccount(account);
        setContract(contractInstance);
      } catch (error) {
        console.error("Wallet init error:", error);
      }
    };
    init();
  }, []);

  // 🔄 Ambil status game dari blockchain
  const fetchStatus = useCallback(async () => {
    if (!contract || !account) return;
    try {
      const state = await getPVPGameState(contract, account);
      setStatus(state.status);
      setOpponentStatus(state.opponentStatus);
      setIsMyTurn(state.isMyTurn);
      setGameOver(state.gameOver);
      setWinner(state.winner);
    } catch (error) {
      console.error("Fetch game state error:", error);
    }
  }, [contract, account]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  // 🎯 Tangani aksi pemain
  const handleAction = async (action) => {
    try {
      const soundMap = {
        attack: attackSound,
        defend: defendSound,
        heal: healSound,
      };
      new Audio(soundMap[action]).play();
      await handlePVPAction(contract, account, action);
    } catch (error) {
      console.error("Action error:", error);
    }
  };

  const restartGame = () => {
    setGameOver(false);
    setWinner(null);
    setStatus(null);
    setOpponentStatus(null);
  };

  // 🧠 UI Handling
  if (!account) return <div className="text-center mt-10">Connect wallet to continue.</div>;
  if (!status || !opponentStatus) return <div className="text-center mt-10">Loading game status...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-black text-white p-4">
      <h1 className="text-4xl font-bold mb-6">Arena Duel PvP</h1>

      <div className="w-full max-w-3xl grid grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col items-center">
          <h2 className="text-xl mb-2">You</h2>
          <HealthBar hp={status.hp} />
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-xl mb-2">Opponent</h2>
          <HealthBar hp={opponentStatus.hp} />
        </div>
      </div>

      {gameOver ? (
        <GameOverModal winner={winner} onRestart={restartGame} />
      ) : (
        <ActionButtons disabled={!isMyTurn} onAction={handleAction} />
      )}
    </div>
  );
};

export default ArenaPVP;
