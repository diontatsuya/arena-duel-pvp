export function isPlayerTurn(playerAddress, currentTurnAddress) {
  return playerAddress.toLowerCase() === currentTurnAddress.toLowerCase();
}
