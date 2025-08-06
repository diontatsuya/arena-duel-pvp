export const contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "battleId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "enum ArenaDuelTurnBasedV2.Action",
				"name": "action",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "playerHP",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "opponentHP",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "isNextPlayer1Turn",
				"type": "bool"
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
				"internalType": "uint256",
				"name": "battleId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "winner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "loser",
				"type": "address"
			}
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
		"inputs": [],
		"name": "leaveMatchmaking",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "battleId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "player1",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "player2",
				"type": "address"
			}
		],
		"name": "MatchFound",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "enum ArenaDuelTurnBasedV2.Action",
				"name": "_action",
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
				"name": "",
				"type": "address"
			}
		],
		"name": "activeBattleId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "battleCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "battles",
		"outputs": [
			{
				"internalType": "address",
				"name": "player1",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "player2",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "player1HP",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "player2HP",
				"type": "uint256"
			},
			{
				"internalType": "enum ArenaDuelTurnBasedV2.Action",
				"name": "lastActionPlayer1",
				"type": "uint8"
			},
			{
				"internalType": "enum ArenaDuelTurnBasedV2.Action",
				"name": "lastActionPlayer2",
				"type": "uint8"
			},
			{
				"internalType": "bool",
				"name": "isPlayer1Turn",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			},
			{
				"internalType": "enum ArenaDuelTurnBasedV2.BattleResult",
				"name": "resultPlayer1",
				"type": "uint8"
			},
			{
				"internalType": "enum ArenaDuelTurnBasedV2.BattleResult",
				"name": "resultPlayer2",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "battleId",
				"type": "uint256"
			}
		],
		"name": "getBattle",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "player1",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "player2",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "player1HP",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "player2HP",
						"type": "uint256"
					},
					{
						"internalType": "enum ArenaDuelTurnBasedV2.Action",
						"name": "lastActionPlayer1",
						"type": "uint8"
					},
					{
						"internalType": "enum ArenaDuelTurnBasedV2.Action",
						"name": "lastActionPlayer2",
						"type": "uint8"
					},
					{
						"internalType": "bool",
						"name": "isPlayer1Turn",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "isActive",
						"type": "bool"
					},
					{
						"internalType": "enum ArenaDuelTurnBasedV2.BattleResult",
						"name": "resultPlayer1",
						"type": "uint8"
					},
					{
						"internalType": "enum ArenaDuelTurnBasedV2.BattleResult",
						"name": "resultPlayer2",
						"type": "uint8"
					}
				],
				"internalType": "struct ArenaDuelTurnBasedV2.Battle",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMyBattle",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "player1",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "player2",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "player1HP",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "player2HP",
						"type": "uint256"
					},
					{
						"internalType": "enum ArenaDuelTurnBasedV2.Action",
						"name": "lastActionPlayer1",
						"type": "uint8"
					},
					{
						"internalType": "enum ArenaDuelTurnBasedV2.Action",
						"name": "lastActionPlayer2",
						"type": "uint8"
					},
					{
						"internalType": "bool",
						"name": "isPlayer1Turn",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "isActive",
						"type": "bool"
					},
					{
						"internalType": "enum ArenaDuelTurnBasedV2.BattleResult",
						"name": "resultPlayer1",
						"type": "uint8"
					},
					{
						"internalType": "enum ArenaDuelTurnBasedV2.BattleResult",
						"name": "resultPlayer2",
						"type": "uint8"
					}
				],
				"internalType": "struct ArenaDuelTurnBasedV2.Battle",
				"name": "",
				"type": "tuple"
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
		"name": "inMatchmaking",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
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
