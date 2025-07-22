import { useEffect, useState } from "react";
import HealthBar from "../components/game/HealthBar";

const MAX_HP = 100;

const getRandomAction = () => {
  const actions = ["attack", "defend", "heal"];
  return actions[Math.floor(Math.random() * actions.length)];
};

const ArenaPVE = () => {
  const [playerHP, setPlayerHP] = useState(MAX_HP);
  const [enemyHP, setEnemyHP] = useState(MAX_HP);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [log, setLog] = useState([]);

  const handleAction = (action) => {
    if (!playerTurn || playerHP <= 0 || enemyHP <= 0) return;

    let logEntry = `Kamu memilih ${action}`;
    let newEnemyHP = enemyHP;
    let newPlayerHP = playerHP;

    if (action === "attack") {
      newEnemyHP -= 20;
      logEntry += ` dan menyerang musuh (-20 HP)`;
    } else if (action === "defend") {
      logEntry += ` dan bertahan (kurangi damage musuh nanti)`;
    } else if (action === "heal") {
      newPlayerHP = Math.min(MAX_HP, playerHP + 15);
      logEntry += ` dan menyembuhkan diri (+15 HP)`;
    }

    setTimeout(() => {
      enemyTurn(action === "defend", newPlayerHP, newEnemyHP, logEntry);
    }, 1000);

    setEnemyHP(newEnemyHP);
    setPlayerHP(newPlayerHP);
    setPlayerTurn(false);
    setLog((prev) => [...prev, logEntry]);
  };

  const enemyTurn = (playerDefending, currentPlayerHP, currentEnemyHP, previousLog) => {
    if (currentPlayerHP <= 0 || currentEnemyHP <= 0) return;

    const action = getRandomAction();
    let logEntry = `Musuh memilih ${action}`;
    let newPlayerHP = currentPlayerHP;
    let newEnemyHP = currentEnemyHP;

    if (action === "attack") {
      const damage = playerDefending ? 10 : 20;
      newPlayerHP -= damage;
      logEntry += ` dan menyerangmu (-${damage} HP)`;
    } else if (action === "defend") {
      logEntry += ` dan bertahan`;
    } else if (action === "heal") {
      newEnemyHP = Math.min(MAX_HP, currentEnemyHP + 15);
      logEntry += ` dan menyembuhkan diri (+15 HP)`;
    }

    setTimeout(() => {
      setPlayerHP(newPlayerHP);
      setEnemyHP(newEnemyHP);
      setPlayerTurn(true);
      setLog((prev) => [...prev, logEntry]);
    }, 1000);
  };

  const resetGame = () => {
    setPlayerHP(MAX_HP);
    setEnemyHP(MAX_HP);
    setPlayerTurn(true);
    setLog([]);
  };

  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Mode PvE - Lawan AI</h2>

      <div className="flex justify-around items-center mb-6">
        <div>
          <h3 className="font-semibold">Kamu</h3>
          <HealthBar hp={playerHP} />
        </div>
        <div>
          <h3 className="font-semibold">Musuh AI</h3>
          <HealthBar hp={enemyHP} />
        </div>
      </div>

      {playerHP <= 0 || enemyHP <= 0 ? (
        <div className="mb-4">
          <h3 className="text-xl font-bold">
            {playerHP <= 0 ? "Kamu kalah!" : "Kamu menang!"}
          </h3>
          <button
            className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
            onClick={resetGame}
          >
            Coba Lagi
          </button>
        </div>
      ) : (
        <div className="space-x-2 mb-4">
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleAction("attack")}
            disabled={!playerTurn}
          >
            Serang
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleAction("defend")}
            disabled={!playerTurn}
          >
            Bertahan
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleAction("heal")}
            disabled={!playerTurn}
          >
            Heal
          </button>
        </div>
      )}

      <div className="text-left max-w-md mx-auto bg-black/30 p-4 rounded h-60 overflow-y-auto">
        <h4 className="font-semibold mb-2">Log Pertarungan</h4>
        <ul className="text-sm space-y-1">
          {log.map((entry, index) => (
            <li key={index} className="text-gray-300">• {entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ArenaPVE;
