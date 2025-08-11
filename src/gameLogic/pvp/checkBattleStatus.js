import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import { contractABI } from "../../utils/contractABI";

/**
 * Cek apakah user sedang punya battle aktif via getMyBattle()
 * @param {string} walletAddress - alamat wallet user
 * @param {ethers.Signer} signer - signer wallet yang sudah connect
 * @returns {Promise<string|null>} battleId string jika ada, null jika tidak ada
 */
export const checkBattleStatus = async (walletAddress, signer) => {
  if (!signer || !walletAddress) return null;

  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    const battle = await contract.getMyBattle();

    if (battle && battle.isActive) {
      // Battle aktif, dapatkan battleId (misal: battle.battleId atau harus dipanggil lagi)
      // Dari ABI, getMyBattle tidak mengembalikan battleId, jadi kita harus panggil activeBattleId(walletAddress)
      const battleId = await contract.activeBattleId(walletAddress);
      if (battleId && battleId.toString() !== "0") {
        return battleId.toString();
      }
    }
    return null;
  } catch (error) {
    console.error("checkBattleStatus error:", error);
    return null;
  }
};
