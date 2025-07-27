// src/contractABI.js
export const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum ArenaDuelTurnBased.Action",
        "name": "action",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newHp",
        "type": "uint256"
      }
    ],
    "name": "ActionTaken",
    "type": "event"
  },
  ...
];
