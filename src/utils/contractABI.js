// src/utils/contractABI.js

export const contractAddress = "0x95dd66c55214a3d603fe1657e22f710692fcbd9b";

export const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "player", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "opponent", "type": "address" }
    ],
    "name": "Matched",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "player", "type": "address" },
      { "indexed": false, "internalType": "enum ArenaDuelTurnBased.Action", "name": "action", "type": "uint8" },
      { "indexed": false, "internalType": "uint256", "name": "playerHp", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "opponentHp", "type": "uint256" }
    ],
    "name": "ActionTaken",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "waitingPlayer",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "joinGame",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint8", "name": "action", "type": "uint8" }],
    "name": "takeAction",
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
      { "internalType": "enum ArenaDuelTurnBased.Action", "name": "lastAction", "type": "uint8" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
