export const CONTRACTABI = [
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
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "winner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "loser",
        "type": "address"
      }
    ],
    "name": "GameEnded",
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
      {
        "indexed": true,
        "internalType": "address",
        "name": "player1",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "player2",
        "type": "address"
      }
    ],
    "name": "Matched",
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
    "name": "takeAction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      }
    ],
    "name": "getOpponentData",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "hp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isTurn",
        "type": "bool"
      },
      {
        "internalType": "enum ArenaDuelTurnBased.Action",
        "name": "lastAction",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      }
    ],
    "name": "getPlayerData",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "hp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isTurn",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "opponent",
        "type": "address"
      },
      {
        "internalType": "enum ArenaDuelTurnBased.Action",
        "name": "lastAction",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "players",
    "outputs": [
      {
        "internalType": "address",
        "name": "opponent",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "hp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isTurn",
        "type": "bool"
      },
      {
        "internalType": "enum ArenaDuelTurnBased.Action",
        "name": "lastAction",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "waitingPlayer",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
