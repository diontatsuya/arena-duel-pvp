import { ethers } from "ethers";
import { contractABI } from "../../utils/contractABI";
import { CONTRACT_ADDRESS } from "../../utils/constants";

/**
 * Mengambil data battle berdasarkan ID
 * @param {ethers.Signer} signer - signer wallet yang aktif
 * @param {number|string} battleId - ID battle
 * @returns {Object|null} data battle atau null jika gagal
 */
export const getBattle = async (signer, battleId) => {
  try {
    if (!signer || battleId === undefined || battleId === null) {
      throw new Error("❌ Signer atau Battle ID tidak valid");
    }

    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

    // Panggil data battle dari kontrak
    const battle = await contract.getBattle(battleId);

    if (!battle || !battle.player1 || !battle.player2) {
      throw new Error("❌ Data battle tidak ditemukan atau tidak valid");
    }

    return {
      battleId: battleId.toString(),
      player1: {
        address: battle.player1,
        hp: Number(battle.player1HP ?? 0),
        lastAction: Number(battle.lastActionPlayer1 ?? 0),
        result: Number(battle.resultPlayer1 ?? 0),
      },
      player2: {
        address: battle.player2,
        hp: Number(battle.player2HP ?? 0),
        lastAction: Number(battle.lastActionPlayer2 ?? 0),
        result: Number(battle.resultPlayer2 ?? 0),
      },
      isPlayer1Turn: Boolean(battle.isPlayer1Turn),
      status: Number(battle.status ?? 0),
    };
  } catch (err) {
    console.error("❌ Gagal mendapatkan data battle:", err.message || err);
    return null;
  }
};
