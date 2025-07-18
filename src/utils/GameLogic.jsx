import { useState } from "react";

export const useGameLogic = () => {
  const [playerHP, setPlayerHP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(100);

  const attack = () => {
    setEnemyHP((hp) => Math.max(0, hp - 20));
  };

  const defend = () => {
    setPlayerHP((hp) => Math.min(100, hp + 10));
  };

  const heal = () => {
    setPlayerHP((hp) => Math.min(100, hp + 20));
  };

  return {
    playerHP,
    enemyHP,
    attack,
    defend,
    heal,
  };
};
