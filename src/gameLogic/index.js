// src/gameLogic/index.js
export * from "./engine/Actions";
export * from "./engine/BattleEngine";
export * from "./engine/GameUtils";
export * from "./pvp/PvPManager";
export * from "./pve/AIOpponents"; // sebelumnya typo: AIOpponent → AIOpponents

export { GameState } from "./GameState";
export { TurnManager } from "./TurnManager";
