import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import { contractABI } from "../../utils/contractABI";

/**
 * Mengecek apakah wallet saat ini sedang berada dalam battle aktif.
 * @param {string} walletAddress - Alamat wallet yang ingin dicek.
 * @param {ethers.Signer} signer - Signer dari wallet yang sudah terhubung.
 * @returns {string|null} battleId jika aktif, null jika tidak.
 */
export async function checkBattleStatus(walletAddress, signer) {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    const battleId = await contract.getPlayerBattle(walletAddress);

    // Cek apakah battleId valid (tidak nol)
    if (battleId && battleId > 0n) {
      return battleId.toString(); // kembalikan dalam format string
    } else {
      return null;
    }
  } catch (err) {
    console.error("Gagal memeriksa status battle:", err);
    return null;
  }
}
