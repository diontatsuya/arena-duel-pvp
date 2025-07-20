// src/gameLogic/pvp/PvPManager.js
export const getOpponent = (players, currentPlayer) => {
  return players.find(p => p.address !== currentPlayer.address);
};

export const isPlayerTurn = (turnAddress, playerAddress) => {
  return turnAddress === playerAddress;
};
