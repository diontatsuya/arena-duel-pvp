import { ethers } from "ethers";
import { contractABI } from "../../utils/contractABI";
import { CONTRACT_ADDRESS } from "../../utils/constants";

export const getBattle = async (provider, battleId) => {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
    const battle = await contract.getBattle(battleId);

    return {
      battleId: battleId.toString(),
      player1: {
        address: battle.player1.addr,
        hp: Number(battle.player1.hp),
        lastAction: Number(battle.player1.lastAction),
        defending: battle.player1.defending,
      },
      player2: {
        address: battle.player2.addr,
        hp: Number(battle.player2.hp),
        lastAction: Number(battle.player2.lastAction),
        defending: battle.player2.defending,
      },
      // turn: battle.currentTurn, // ❌ tidak ada di ABI
      state: Number(battle.state),
      winner: battle.winner,
    };
  } catch (err) {
    console.error("Gagal mendapatkan data battle:", err);
    return null;
  }
};
