import React, { useState } from "react";

export default function ArenaPVE() {
  const [playerHP, setPlayerHP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(100);
  const [log, setLog] = useState([]);

  const handleAction = (action) => {
    let newLog = [`You chose ${action}`];
    let enemyAction = ["attack", "defend", "heal"][Math.floor(Math.random() * 3)];
    newLog.push(`Enemy chose ${enemyAction}`);

    let newPlayerHP = playerHP;
    let newEnemyHP = enemyHP;

    // Simulasi damage
    if (action === "attack" && enemyAction !== "defend") newEnemyHP -= 20;
    if (enemyAction === "attack" && action !== "defend") newPlayerHP -= 20;
    if (action === "heal") newPlayerHP += 10;
    if (enemyAction === "heal") newEnemyHP += 10;

    setPlayerHP(Math.max(0, Math.min(100, newPlayerHP)));
    setEnemyHP(Math.max(0, Math.min(100, newEnemyHP)));
    setLog((prev) => [...prev, ...newLog]);
  };

  return (
    <div className="p-4">
      <h2>PVE Mode</h2>
      <p>Your HP: {playerHP}</p>
      <p>Enemy HP: {enemyHP}</p>

      <div className="flex gap-2 mt-4">
        <button onClick={() => handleAction("attack")}>Attack</button>
        <button onClick={() => handleAction("defend")}>Defend</button>
        <button onClick={() => handleAction("heal")}>Heal</button>
      </div>

      <div className="mt-4">
        <h3>Battle Log:</h3>
        <ul>
          {log.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
