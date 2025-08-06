import { ethers } from "ethers";
import { contractABI } from "../../utils/contractABI";
import { CONTRACT_ADDRESS } from "../../utils/constants";

export const getBattle = async (signer, battleId) => {
  try {
    if (!signer || !battleId) {
      throw new Error("Signer atau Battle ID tidak valid");
    }

    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    const battle = await contract.getBattle(battleId);

    return {
      battleId: battleId.toString(),
      player1: {
        address: battle.player1,
        hp: Number(battle.player1HP),
        lastAction: Number(battle.lastActionPlayer1),
        result: Number(battle.resultPlayer1),
      },
      player2: {
        address: battle.player2,
        hp: Number(battle.player2HP),
        lastAction: Number(battle.lastActionPlayer2),
        result: Number(battle.resultPlayer2),
      },
      isPlayer1Turn: battle.isPlayer1Turn,
      status: Number(battle.status),
    };
  } catch (err) {
    console.error("❌ Gagal mendapatkan data battle:", err);
    return null;
  }
};
