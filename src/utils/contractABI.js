export const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "battleId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "player1", "type": "address" }
    ],
    "name": "BattleCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "battleId", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "winner", "type": "address" },
      { "indexed": false, "internalType": "address", "name": "loser", "type": "address" }
    ],
    "name": "BattleEnded",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "joinMatchmaking",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "battleId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "player2", "type": "address" }
    ],
    "name": "PlayerJoined",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "enum ArenaDuelTurnBased.Action",
        "name": "action",
        "type": "uint8"
      }
    ],
    "name": "takeTurn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "battleId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "player", "type": "address" },
      { "indexed": false, "internalType": "enum ArenaDuelTurnBased.Action", "name": "action", "type": "uint8" },
      { "indexed": false, "internalType": "uint256", "name": "hp", "type": "uint256" }
    ],
    "name": "TurnTaken",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "battleCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "player", "type": "address" }
    ],
    "name": "getStatus",
    "outputs": [
      { "internalType": "uint256", "name": "battleId", "type": "uint256" },
      { "internalType": "address", "name": "player1", "type": "address" },
      { "internalType": "address", "name": "player2", "type": "address" },
      { "internalType": "uint8", "name": "turn", "type": "uint8" },
      { "internalType": "uint256", "name": "hp", "type": "uint256" },
      { "internalType": "enum ArenaDuelTurnBased.Action", "name": "lastAction", "type": "uint8" },
      { "internalType": "bool", "name": "isActive", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "name": "playerBattle",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
