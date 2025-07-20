// src/gameLogic/pve/AIOpponent.js
import { ActionType } from "../engine/Actions";
import { getRandomInt } from "../engine/GameUtils";

export const chooseAIAction = (aiState) => {
  const actions = [ActionType.ATTACK, ActionType.DEFEND, ActionType.HEAL];
  const randomIndex = getRandomInt(0, actions.length - 1);
  return actions[randomIndex];
};
