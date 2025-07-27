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
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState("");

  useEffect(() => {
    if (!signer || !playerAddress) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

    const fetchStatus = async () => {
      try {
        const playerStat = await contract.getPlayerStatus(playerAddress);
        const playerInfo = await contract.players(playerAddress);
        const opponentStat = await contract.getPlayerStatus(playerInfo.opponent);

        setStatus(playerStat);
        setOpponentStatus(opponentStat);

        if (!gameOver) {
          if (playerStat.hp === 0 && opponentStat.hp === 0) {
            setGameOver(true);
            setWinner("Draw");
          } else if (playerStat.hp === 0) {
            setGameOver(true);
            setWinner("Lawan Menang");
          } else if (opponentStat.hp === 0) {
            setGameOver(true);
            setWinner("Kamu Menang");
          }
        }
      } catch (err) {
        console.error("Gagal ambil status:", err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [signer, playerAddress, gameOver]);

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

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="text-center mt-8 space-y-4">
      <h2 className="text-xl font-semibold">Arena Duel PvP</h2>

      <div className="mt-4 p-4 bg-gray-800 rounded-xl shadow-md">
        <h3 className="text-lg font-bold mb-2">Kamu</h3>
        <p>{status.hp} / 100</p>
        <p>Last Action: {actionToString(status.lastAction)}</p>
      </div>

      {!gameOver && (
        <p className="text-yellow-400 font-medium">
          {status.isTurn ? "Giliran kamu!" : "Menunggu giliran..."}
        </p>
      )}

      {gameOver && (
        <div className="mt-4 text-red-400 font-semibold">
          <p>🎮 Game selesai!</p>
          <p className="text-lg">{winner}</p>
          <button
            onClick={handleReload}
            className="mt-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Mulai Ulang
          </button>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-800 rounded-xl shadow-md">
        <h3 className="text-lg font-bold mb-2">Lawan</h3>
        <p>{opponentStatus.hp} / 100</p>
        <p>Last Action: {actionToString(opponentStatus.lastAction)}</p>
      </div>
    </div>
  );
};

export default GameStatus;
