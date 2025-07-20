import { useEffect, useState } from "react";
import { handlePlayerAction, performAIAction } from "../gameLogic/pve/handleActionPve";
import HealthBar from "../components/ui/HealthBar";

const ArenaPVE = () => {
  const [player, setPlayer] = useState({ hp: 100 });
  const [ai, setAI] = useState({ hp: 100 });
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!isPlayerTurn && ai.hp > 0 && player.hp > 0) {
      const timer = setTimeout(() => {
        const result = performAIAction(player, ai);
        setPlayer(result.updatedPlayer);
        setStatus(`AI uses ${result.actionName}`);
        setIsPlayerTurn(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn]);

  const handleAction = (action) => {
    if (!isPlayerTurn || player.hp <= 0 || ai.hp <= 0) return;

    const result = handlePlayerAction(action, player, ai);
    setPlayer(result.updatedPlayer);
    setAI(result.updatedAI);
    setStatus(`You used ${result.actionName}`);
    setIsPlayerTurn(false);
  };

  return (
    <div className="p-4">
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
        <button onClick={() => handleAction("attack")} disabled={!isPlayerTurn} className="btn">
          Attack
        </button>
        <button onClick={() => handleAction("defend")} disabled={!isPlayerTurn} className="btn">
          Defend
        </button>
        <button onClick={() => handleAction("heal")} disabled={!isPlayerTurn} className="btn">
          Heal
        </button>
      </div>
    </div>
  );
};

export default ArenaPVE;
