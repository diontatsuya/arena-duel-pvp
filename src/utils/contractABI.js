export const contractABI = [
  {
    "inputs": [],
    "name": "joinArena",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint8", "name": "action", "type": "uint8" }],
    "name": "performAction",
    "outputs": [],
    "stateMutability": "nonpayable",
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
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
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
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "address", "name": "player", "type": "address" },
      { "indexed": false, "internalType": "uint8", "name": "action", "type": "uint8" }
    ],
    "name": "ActionPerformed",
    "type": "event"
  }
];
