import { useState, useEffect } from "react";
import { getRandomAIAction, calculatePVEResult } from "../gameLogic/pve/pveLogic";
import { getPVEAnimationClass } from "../gameLogic/pve/pveAnimations";
import HealthBar from "../components/game/HealthBar";
import ActionButtons from "../components/game/ActionButtons";

const GamePVE = () => {
  const [playerHP, setPlayerHP] = useState(100);
  const [aiHP, setAIHP] = useState(100);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [log, setLog] = useState([]);
  const [animation, setAnimation] = useState({ player: "", ai: "" });

  const handleAction = (action) => {
    if (!isPlayerTurn) return;

    const aiAction = getRandomAIAction();
    const result = calculatePVEResult(action, aiAction, playerHP, aiHP);

    setPlayerHP(result.newPlayerHP);
    setAIHP(result.newAIHP);
    setAnimation({
      player: getPVEAnimationClass(action, true),
      ai: getPVEAnimationClass(aiAction, false),
    });

    setLog((prev) => [
      ...prev,
      `Player chose ${action}, AI chose ${aiAction}.`,
    ]);

    setIsPlayerTurn(false);

    setTimeout(() => {
      setAnimation({ player: "", ai: "" });
      setIsPlayerTurn(true);
    }, 1000);
  };

  useEffect(() => {
    if (playerHP <= 0 || aiHP <= 0) {
      setLog((prev) => [
        ...prev,
        playerHP <= 0 ? "You lost!" : "You won!",
      ]);
      setIsPlayerTurn(false);
    }
  }, [playerHP, aiHP]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-4">PvE Duel</h1>

      <div className="flex justify-around mb-4">
        <div className={`transition-all duration-500 ${animation.player}`}>
          <HealthBar label="You" hp={playerHP} />
        </div>
        <div className={`transition-all duration-500 ${animation.ai}`}>
          <HealthBar label="AI" hp={aiHP} />
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <ActionButtons onAction={handleAction} disabled={!isPlayerTurn || playerHP <= 0 || aiHP <= 0} />
      </div>

      <div className="bg-gray-800 p-2 rounded-md max-h-48 overflow-y-auto text-sm">
        {log.map((entry, idx) => (
          <div key={idx}>{entry}</div>
        ))}
      </div>
    </div>
  );
};

export default GamePVE;
