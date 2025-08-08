import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import { contractABI } from "../../utils/contractABI";

/**
 * Mengecek apakah wallet sedang dalam battle aktif (PvP atau PvE).
 * @param {string} walletAddress - Alamat wallet pemain.
 * @param {ethers.Signer} signer - Signer dari provider.
 * @returns {Promise<string|null>} - battleId jika aktif, null jika tidak.
 */
export async function checkBattleStatus(walletAddress, signer) {
  if (!walletAddress || !signer) {
    console.warn("Alamat wallet atau signer tidak tersedia.");
    return null;
  }

  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

    const battleIdBN = await contract.activeBattleId(walletAddress);
    const battleId = battleIdBN.toString();

    if (battleId === "0") return null;

    const battle = await contract.getBattle(battleIdBN);

    if (battle?.isActive) {
      return battleId;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Gagal memeriksa status battle:", error);
    return null;
  }
}
