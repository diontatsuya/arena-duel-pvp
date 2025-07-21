import { useState, useEffect } from "react";
import HealthBar from "../components/ui/HealthBar";
import { getRandomAIAction, processTurn } from "../gameLogic/pveLogic";

const GamePVE = () => {
  const [playerHP, setPlayerHP] = useState(100);
  const [aiHP, setAIHP] = useState(100);
  const [turn, setTurn] = useState("player"); // "player" or "ai"
  const [log, setLog] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const handlePlayerAction = (action) => {
    if (turn !== "player" || disabled) return;

    setDisabled(true);

    const aiAction = getRandomAIAction();
    const result = processTurn(action, aiAction, playerHP, aiHP);

    setPlayerHP(result.playerHP);
    setAIHP(result.aiHP);
    setLog((prev) => [...prev, `Player: ${action}`, `AI: ${aiAction}`]);

    setTimeout(() => {
      setTurn("player");
      setDisabled(false);
    }, 1000);
  };

  useEffect(() => {
    if (playerHP <= 0 || aiHP <= 0) {
      setDisabled(true);
      setLog((prev) => [...prev, playerHP <= 0 ? "You Lost!" : "You Win!"]);
    }
  }, [playerHP, aiHP]);

  return (
    <div className="max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">PvE Battle</h2>

      <div className="mb-4">
        <p>Player HP</p>
        <HealthBar hp={playerHP} />
        <p>AI HP</p>
        <HealthBar hp={aiHP} />
      </div>

      <div className="space-x-4 mb-4">
        <button onClick={() => handlePlayerAction("attack")} disabled={disabled} className="btn">Attack</button>
        <button onClick={() => handlePlayerAction("defend")} disabled={disabled} className="btn">Defend</button>
        <button onClick={() => handlePlayerAction("heal")} disabled={disabled} className="btn">Heal</button>
      </div>

      <div className="bg-gray-800 p-2 rounded text-left h-40 overflow-y-auto text-sm">
        {log.map((entry, i) => (
          <p key={i}>{entry}</p>
        ))}
      </div>
    </div>
  );
};

export default GamePVE;
