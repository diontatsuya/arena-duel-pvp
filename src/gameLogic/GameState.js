// GameState.js
export class GameState {
  constructor(playerHP = 100, opponentHP = 100) {
    this.playerHP = playerHP;
    this.opponentHP = opponentHP;
    this.playerDefending = false;
    this.opponentDefending = false;
    this.turn = 'player'; // 'player' or 'opponent'
  }

  switchTurn() {
    this.turn = this.turn === 'player' ? 'opponent' : 'player';
  }

  isGameOver() {
    return this.playerHP <= 0 || this.opponentHP <= 0;
  }

  getWinner() {
    if (this.playerHP <= 0) return 'opponent';
    if (this.opponentHP <= 0) return 'player';
    return null;
  }

  reset() {
    this.playerHP = 100;
    this.opponentHP = 100;
    this.playerDefending = false;
    this.opponentDefending = false;
    this.turn = 'player';
  }
}
