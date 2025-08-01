import { ethers } from "ethers";
import { contractABI } from "../constants/contractABI";
import { CONTRACT_ADDRESS } from "../constants";

export const getBattle = async (provider, battleId) => {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
    const battle = await contract.battles(battleId);

    return {
      battleId: battleId.toString(),
      player1: {
        address: battle.player1.addr,
        hp: battle.player1.hp.toNumber(),
        lastAction: battle.player1.lastAction, // uint8 (0: attack, 1: defend, 2: heal)
      },
      player2: {
        address: battle.player2.addr,
        hp: battle.player2.hp.toNumber(),
        lastAction: battle.player2.lastAction,
      },
      turn: battle.currentTurn, // address
      state: battle.state, // uint8 enum
    };
  } catch (err) {
    console.error("Gagal mendapatkan data battle:", err);
    return null;
  }
};
