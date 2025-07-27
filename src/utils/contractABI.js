export const contractABI = [
  {
    "inputs": [],
    "name": "joinGame",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint8", "name": "_action", "type": "uint8" }
    ],
    "name": "performAction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_player", "type": "address" }
    ],
    "name": "getPlayerStatus",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "opponent", "type": "address" },
          { "internalType": "uint256", "name": "hp", "type": "uint256" },
          { "internalType": "bool", "name": "isTurn", "type": "bool" },
          { "internalType": "uint8", "name": "lastAction", "type": "uint8" }
        ],
        "internalType": "struct ArenaDuelTurnBased.Player",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
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
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "player", "type": "address" },
      { "indexed": false, "internalType": "uint8", "name": "action", "type": "uint8" },
      { "indexed": false, "internalType": "uint256", "name": "damage", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "heal", "type": "uint256" }
    ],
    "name": "ActionTaken",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "player1", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "player2", "type": "address" }
    ],
    "name": "Matched",
    "type": "event"
  }
];
