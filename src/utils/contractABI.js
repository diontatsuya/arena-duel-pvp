export const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "player", "type": "address" },
      { "indexed": false, "internalType": "uint8", "name": "action", "type": "uint8" },
      { "indexed": false, "internalType": "uint256", "name": "playerHp", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "opponentHp", "type": "uint256" }
    ],
    "name": "ActionTaken",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "winner", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "loser", "type": "address" }
    ],
    "name": "GameOver",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "player", "type": "address" }
    ],
    "name": "GameReset",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "joinGame",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "player1", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "player2", "type": "address" }
    ],
    "name": "Matched",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "resetGame",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "enum ArenaDuelTurnBased.Action", "name": "action", "type": "uint8" }
    ],
    "name": "takeAction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMyStatus",
    "outputs": [
      { "internalType": "address", "name": "opponent", "type": "address" },
      { "internalType": "uint256", "name": "myHp", "type": "uint256" },
      { "internalType": "uint256", "name": "opponentHp", "type": "uint256" },
      { "internalType": "bool", "name": "isMyTurn", "type": "bool" },
      { "internalType": "uint8", "name": "myLastAction", "type": "uint8" },
      { "internalType": "uint8", "name": "opponentLastAction", "type": "uint8" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "name": "players",
    "outputs": [
      { "internalType": "address", "name": "opponent", "type": "address" },
      { "internalType": "uint256", "name": "hp", "type": "uint256" },
      { "internalType": "bool", "name": "isTurn", "type": "bool" },
      { "internalType": "uint8", "name": "lastAction", "type": "uint8" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "waitingPlayer",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
