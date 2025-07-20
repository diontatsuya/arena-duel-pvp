// TurnManager.js

export class TurnManager {
  constructor() {
    this.turnQueue = []; // Array of player addresses or identifiers
    this.currentTurnIndex = 0;
  }

  setPlayers(player1, player2) {
    this.turnQueue = [player1, player2];
    this.currentTurnIndex = 0;
  }

  getCurrentPlayer() {
    return this.turnQueue[this.currentTurnIndex];
  }

  getOpponentPlayer() {
    return this.turnQueue[(this.currentTurnIndex + 1) % 2];
  }

  nextTurn() {
    this.currentTurnIndex = (this.currentTurnIndex + 1) % this.turnQueue.length;
  }

  resetTurns() {
    this.currentTurnIndex = 0;
  }
}
