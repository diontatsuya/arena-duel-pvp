import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import { contractABI } from "../../utils/contractABI";

const GameStatus = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [player, setPlayer] = useState({});
  const [opponent, setOpponent] = useState({});
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);

  const ACTIONS = ["None", "Attack", "Defend", "Heal"];

  const fetchPlayerStatus = async () => {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const playerData = await contract.players(accounts[0]);
      const opponentData = await contract.players(playerData.opponent);

      setPlayer({
        hp: playerData.hp.toNumber(),
        lastAction: ACTIONS[playerData.lastAction],
      });

      setOpponent({
        hp: opponentData.hp.toNumber(),
        lastAction: ACTIONS[opponentData.lastAction],
      });

      setIsPlayerTurn(playerData.isTurn);
    } catch (error) {
      console.error("Failed to fetch player status:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const tempProvider = new ethers.BrowserProvider(window.ethereum);
        const tempSigner = await tempProvider.getSigner();
        const tempContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, tempSigner);

        setProvider(tempProvider);
        setSigner(tempSigner);
        setContract(tempContract);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (contract) {
      fetchPlayerStatus(); // initial fetch

      const interval = setInterval(() => {
        fetchPlayerStatus(); // fetch periodically
      }, 3000); // every 3 seconds

      return () => clearInterval(interval); // cleanup
    }
  }, [contract]);

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md w-full max-w-md mx-auto text-center">
      <h2 className="text-xl font-bold mb-4 text-yellow-300">Arena Duel PvP</h2>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Kamu</h3>
        <p className="text-green-400">HP: {player.hp ?? "?"} / 100</p>
        <p>Last Action: {player.lastAction ?? "?"}</p>
      </div>

      <div className="mb-4">
        <p className="text-sm italic">
          {isPlayerTurn ? "Giliran kamu!" : "Menunggu giliran..."}
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Lawan</h3>
        <p className="text-red-400">HP: {opponent.hp ?? "?"} / 100</p>
        <p>Last Action: {opponent.lastAction ?? "?"}</p>
      </div>
    </div>
  );
};

export default GameStatus;
