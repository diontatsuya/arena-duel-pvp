export const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "battleId", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "player", "type": "address" },
      { "indexed": false, "internalType": "enum ArenaDuelTurnBasedV2.Action", "name": "action", "type": "uint8" },
      { "indexed": false, "internalType": "uint256", "name": "playerHp", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "opponentHp", "type": "uint256" }
    ],
    "name": "ActionTaken",
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
    "inputs": [],
    "name": "leaveBattle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "battleId", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "player1", "type": "address" },
      { "indexed": false, "internalType": "address", "name": "player2", "type": "address" }
    ],
    "name": "MatchFound",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "battleId", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "leaver", "type": "address" },
      { "indexed": false, "internalType": "address", "name": "opponent", "type": "address" }
    ],
    "name": "PlayerLeftBattle",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "enum ArenaDuelTurnBasedV2.Action", "name": "action", "type": "uint8" }
    ],
    "name": "takeAction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "battleCounter",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "battles",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "addr", "type": "address" },
          { "internalType": "uint256", "name": "hp", "type": "uint256" },
          { "internalType": "enum ArenaDuelTurnBasedV2.Action", "name": "lastAction", "type": "uint8" }
        ],
        "internalType": "struct ArenaDuelTurnBasedV2.Player",
        "name": "player1",
        "type": "tuple"
      },
      {
        "components": [
          { "internalType": "address", "name": "addr", "type": "address" },
          { "internalType": "uint256", "name": "hp", "type": "uint256" },
          { "internalType": "enum ArenaDuelTurnBasedV2.Action", "name": "lastAction", "type": "uint8" }
        ],
        "internalType": "struct ArenaDuelTurnBasedV2.Player",
        "name": "player2",
        "type": "tuple"
      },
      { "internalType": "address", "name": "currentTurn", "type": "address" },
      { "internalType": "enum ArenaDuelTurnBasedV2.BattleState", "name": "state", "type": "uint8" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "battleId", "type": "uint256" }
    ],
    "name": "getBattleStatus",
    "outputs": [
      { "internalType": "address", "name": "player1", "type": "address" },
      { "internalType": "uint256", "name": "hp1", "type": "uint256" },
      { "internalType": "enum ArenaDuelTurnBasedV2.Action", "name": "action1", "type": "uint8" },
      { "internalType": "address", "name": "player2", "type": "address" },
      { "internalType": "uint256", "name": "hp2", "type": "uint256" },
      { "internalType": "enum ArenaDuelTurnBasedV2.Action", "name": "action2", "type": "uint8" },
      { "internalType": "address", "name": "currentTurn", "type": "address" },
      { "internalType": "enum ArenaDuelTurnBasedV2.BattleState", "name": "state", "type": "uint8" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "player", "type": "address" }
    ],
    "name": "getPlayerBattle",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "name": "playerToBattleId",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
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
