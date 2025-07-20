// src/gameLogic/engine/BattleEngine.js
import { ActionType, getActionEffect } from "./Actions";

export const executeTurn = ({ attacker, defender, action }) => {
  const effect = getActionEffect(action, { attacker, defender });

  let result = {
    attackerHP: attacker.hp,
    defenderHP: defender.hp,
    action,
    log: "",
  };

  if (action === ActionType.ATTACK) {
    result.defenderHP = Math.max(0, defender.hp - effect.damage);
    result.log = `${attacker.name} attacked for ${effect.damage} damage!`;
  } else if (action === ActionType.DEFEND) {
    result.log = `${attacker.name} is defending!`;
  } else if (action === ActionType.HEAL) {
    result.attackerHP = Math.min(100, attacker.hp + effect.heal);
    result.log = `${attacker.name} healed for ${effect.heal} HP!`;
  }

  return result;
};
