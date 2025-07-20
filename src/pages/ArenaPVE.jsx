import React, { useState } from "react";
import HealthBar from "../components/ui/HealthBar";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const MAX_HEALTH = 100;

const ArenaPVE = () => {
  const [playerHealth, setPlayerHealth] = useState(MAX_HEALTH);
  const [enemyHealth, setEnemyHealth] = useState(MAX_HEALTH);
  const [turn, setTurn] = useState("player"); // 'player' or 'enemy'
  const [log, setLog] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const enemyAction = () => {
    setTimeout(() => {
      const action = Math.random();
      let newPlayerHealth = playerHealth;

      if (action < 0.5) {
        newPlayerHealth -= 15;
        setLog((prev) => [...prev, "Enemy attacks!"]);
      } else {
        newPlayerHealth += 10;
        if (newPlayerHealth > MAX_HEALTH) newPlayerHealth = MAX_HEALTH;
        setLog((prev) => [...prev, "Enemy heals!"]);
      }

      if (newPlayerHealth <= 0) {
        setPlayerHealth(0);
        setGameOver(true);
        setLog((prev) => [...prev, "💀 You lost!"]);
      } else {
        setPlayerHealth(newPlayerHealth);
        setTurn("player");
      }
    }, 1000);
  };

  const handleAction = (action) => {
    if (turn !== "player" || gameOver) return;

    let newEnemyHealth = enemyHealth;
    let newPlayerHealth = playerHealth;

    if (action === "attack") {
      newEnemyHealth -= 20;
      setLog((prev) => [...prev, "You attack!"]);
    } else if (action === "defend") {
      setLog((prev) => [...prev, "You defend! (no effect yet)"]);
    } else if (action === "heal") {
      newPlayerHealth += 15;
      if (newPlayerHealth > MAX_HEALTH) newPlayerHealth = MAX_HEALTH;
      setLog((prev) => [...prev, "You heal!"]);
    }

    if (newEnemyHealth <= 0) {
      setEnemyHealth(0);
      setGameOver(true);
      setLog((prev) => [...prev, "🏆 You win!"]);
    } else {
      setEnemyHealth(newEnemyHealth);
      setPlayerHealth(newPlayerHealth);
      setTurn("enemy");
      enemyAction();
    }
  };

  const handleRestart = () => {
    setPlayerHealth(MAX_HEALTH);
    setEnemyHealth(MAX_HEALTH);
    setTurn("player");
    setLog([]);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white px-4">
      <h1 className="text-3xl font-bold mb-6">Arena PvE</h1>
      <Card className="w-full max-w-md p-4 bg-gray-900 rounded-2xl shadow-lg">
        <CardContent className="space-y-4">
          <div>
            <p className="font-semibold">Player</p>
            <HealthBar health={playerHealth} />
          </div>
          <div>
            <p className="font-semibold">Enemy AI</p>
            <HealthBar health={enemyHealth} />
          </div>
          <p className="text-center font-mono text-sm">
            {gameOver ? "Game Over" : `${turn === "player" ? "Your" : "Enemy"} Turn`}
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => handleAction("attack")} disabled={turn !== "player" || gameOver}>
              Attack
            </Button>
            <Button onClick={() => handleAction("defend")} disabled={turn !== "player" || gameOver}>
              Defend
            </Button>
            <Button onClick={() => handleAction("heal")} disabled={turn !== "player" || gameOver}>
              Heal
            </Button>
          </div>
          {gameOver && (
            <div className="text-center mt-4">
              <Button onClick={handleRestart} variant="outline">
                Restart Game
              </Button>
            </div>
          )}
          <div className="text-xs mt-4 bg-gray-800 p-2 rounded-md max-h-32 overflow-y-auto">
            {log.map((entry, idx) => (
              <div key={idx}>{entry}</div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArenaPVE;
