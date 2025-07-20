// src/gameLogic/pvp/PvPManager.js

import { ethers } from "ethers";
import { contractABI } from "../../utils/contractABI";
import { CONTRACT_ADDRESS } from "../../utils/constants";

// Mendapatkan status game PVP untuk wallet tertentu
export const getPVPGameState = async (contract, walletAddress) => {
  const player = await contract.players(walletAddress);
  const opponent = await contract.players(player.opponent);

  return {
    player: {
      address: walletAddress,
      hp: player.hp.toNumber(),
      lastAction: player.lastAction,
      isTurn: player.isTurn,
    },
    opponent: {
      address: player.opponent,
      hp: opponent.hp.toNumber(),
      lastAction: opponent.lastAction,
      isTurn: opponent.isTurn,
    },
  };
};

// Menangani aksi: Attack, Defend, Heal
export const handlePVPAction = async (contract, actionType) => {
  const tx = await contract.takeAction(actionType);
  await tx.wait();
};
