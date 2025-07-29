export const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "battleId", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "player1", "type": "address" },
      { "indexed": false, "internalType": "address", "name": "player2", "type": "address" }
    ],
    "name": "BattleStarted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "battleId", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "winner", "type": "address" }
    ],
    "name": "BattleEnded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "battleId", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "player", "type": "address" },
      { "indexed": false, "internalType": "enum ArenaDuelTurnBasedV2.Action", "name": "action", "type": "uint8" }
    ],
    "name": "ActionTaken",
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
    "inputs": [],
    "name": "leaveBattle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "takeAction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "player", "type": "address" }],
    "name": "getPlayerBattle",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "battleId", "type": "uint256" }],
    "name": "getBattleStatus",
    "outputs": [
      { "internalType": "address", "name": "player1", "type": "address" },
      { "internalType": "address", "name": "player2", "type": "address" },
      { "internalType": "uint256", "name": "player1HP", "type": "uint256" },
      { "internalType": "uint256", "name": "player2HP", "type": "uint256" },
      { "internalType": "enum ArenaDuelTurnBasedV2.Action", "name": "player1Action", "type": "uint8" },
      { "internalType": "enum ArenaDuelTurnBasedV2.Action", "name": "player2Action", "type": "uint8" },
      { "internalType": "address", "name": "turn", "type": "address" },
      { "internalType": "bool", "name": "isActive", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
