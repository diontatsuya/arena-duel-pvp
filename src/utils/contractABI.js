export const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "address", "name": "player", "type": "address" },
      { "indexed": false, "internalType": "enum ArenaDuelTurnBased.Action", "name": "action", "type": "uint8" },
      { "indexed": false, "internalType": "uint256", "name": "playerHp", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "opponentHp", "type": "uint256" }
    ],
    "name": "ActionTaken",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "address", "name": "winner", "type": "address" },
      { "indexed": false, "internalType": "address", "name": "loser", "type": "address" }
    ],
    "name": "GameOver",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "enum ArenaDuelTurnBased.GameMode", "name": "mode", "type": "uint8" }
    ],
    "name": "joinArena",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "address", "name": "player1", "type": "address" },
      { "indexed": false, "internalType": "address", "name": "player2", "type": "address" }
    ],
    "name": "Matched",
    "type": "event"
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
    "inputs": [
      { "internalType": "address", "name": "player", "type": "address" }
    ],
    "name": "getStatus",
    "outputs": [
      { "internalType": "address", "name": "opponent", "type": "address" },
      { "internalType": "uint256", "name": "hp", "type": "uint256" },
      { "internalType": "bool", "name": "isTurn", "type": "bool" },
      { "internalType": "enum ArenaDuelTurnBased.Action", "name": "lastAction", "type": "uint8" }
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
      { "internalType": "enum ArenaDuelTurnBased.Action", "name": "lastAction", "type": "uint8" }
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
