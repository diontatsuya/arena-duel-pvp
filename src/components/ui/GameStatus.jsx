import { useEffect, useState } from "react";
import { contractABI } from "../../utils/contractABI";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import { ethers } from "ethers";

const GameStatus = ({ signer, playerAddress }) => {
  const [status, setStatus] = useState({
    hp: 100,
    lastAction: 0,
    isTurn: false,
  });
  const [opponentStatus, setOpponentStatus] = useState({
    hp: 100,
    lastAction: 0,
    isTurn: false,
  });

  useEffect(() => {
    if (!signer || !playerAddress) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

    const fetchStatus = async () => {
      const status = await contract.getPlayerStatus(playerAddress);
      const opponent = await contract.players(playerAddress);
      const opponentStatus = await contract.getPlayerStatus(opponent.opponent);

      setStatus(status);
      setOpponentStatus(opponentStatus);

      // Notifikasi menang/kalah
      if (status.hp === 0) {
        alert("Kamu KALAH!");
      } else if (opponentStatus.hp === 0) {
        alert("Kamu MENANG!");
      }
    };

    fetchStatus();

    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [signer, playerAddress]);

  const actionToString = (action) => {
    switch (action) {
      case 1:
        return "Attack";
      case 2:
        return "Defend";
      case 3:
        return "Heal";
      default:
        return "None";
    }
  };

  return (
    <div className="text-center mt-8 space-y-4">
      <h2 className="text-xl font-semibold">Arena Duel PvP</h2>

      <div className="mt-4 p-4 bg-gray-800 rounded-xl shadow-md">
        <h3 className="text-lg font-bold mb-2">Kamu</h3>
        <p>{status.hp} / 100</p>
        <p>Last Action: {actionToString(status.lastAction)}</p>
      </div>

      <p className="text-yellow-400 font-medium">
        {status.isTurn ? "Giliran kamu!" : "Menunggu giliran..."}
      </p>

      <div className="mt-4 p-4 bg-gray-800 rounded-xl shadow-md">
        <h3 className="text-lg font-bold mb-2">Lawan</h3>
        <p>{opponentStatus.hp} / 100</p>
        <p>Last Action: {actionToString(opponentStatus.lastAction)}</p>
      </div>
    </div>
  );
};

export default GameStatus;
