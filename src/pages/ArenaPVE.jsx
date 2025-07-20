import { useEffect, useState } from "react";
import { handlePlayerAction, performAIAction } from "../gameLogic/pve/handleActionPVE";
import HealthBar from "../components/ui/HealthBar";

const ArenaPVE = () => {
  const [player, setPlayer] = useState({ hp: 100 });
  const [ai, setAI] = useState({ hp: 100 });
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [status, setStatus] = useState("");
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameOver) return;

    if (!isPlayerTurn && ai.hp > 0 && player.hp > 0) {
      const timer = setTimeout(() => {
        const result = performAIAction(player, ai);
        setPlayer(result.updatedPlayer);
        setStatus(`AI uses ${result.actionName}`);

        if (result.updatedPlayer.hp <= 0) {
          setStatus("You were defeated by the AI!");
          setGameOver(true);
        } else {
          setIsPlayerTurn(true);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, ai, player, gameOver]);

  const handleAction = (action) => {
    if (!isPlayerTurn || player.hp <= 0 || ai.hp <= 0 || gameOver) return;

    const result = handlePlayerAction(action, player, ai);
    setPlayer(result.updatedPlayer);
    setAI(result.updatedAI);
    setStatus(`You used ${result.actionName}`);

    if (result.updatedAI.hp <= 0) {
      setStatus("You defeated the AI!");
      setGameOver(true);
    } else {
      setIsPlayerTurn(false);
    }
  };

  const resetGame = () => {
    setPlayer({ hp: 100 });
    setAI({ hp: 100 });
    setIsPlayerTurn(true);
    setStatus("");
    setGameOver(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-center mb-4">PvE Arena</h2>

      <div className="flex justify-between mb-4">
        <div>
          <p className="font-bold">Player</p>
          <HealthBar hp={player.hp} />
        </div>
        <div>
          <p className="font-bold">AI Enemy</p>
          <HealthBar hp={ai.hp} />
        </div>
      </div>

      <p className="text-center mb-2">{status}</p>

      <div className="flex justify-center gap-4">
        <button onClick={() => handleAction("attack")} disabled={!isPlayerTurn || gameOver} className="btn">
          Attack
        </button>
        <button onClick={() => handleAction("defend")} disabled={!isPlayerTurn || gameOver} className="btn">
          Defend
        </button>
        <button onClick={() => handleAction("heal")} disabled={!isPlayerTurn || gameOver} className="btn">
          Heal
        </button>
      </div>

      {gameOver && (
        <div className="text-center mt-4">
          <button onClick={resetGame} className="btn bg-blue-500 hover:bg-blue-600 text-white">
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
};

export default ArenaPVE;
