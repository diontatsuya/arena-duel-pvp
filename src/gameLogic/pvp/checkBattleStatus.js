import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import { contractABI } from "../../utils/contractABI";

/**
 * Mengecek apakah wallet sedang dalam battle aktif (PvP atau PvE).
 * @param {string} walletAddress - Alamat wallet pemain.
 * @param {ethers.Signer} signer - Signer dari provider.
 * @returns {string|null} - battleId jika aktif, null jika tidak.
 */
export async function checkBattleStatus(walletAddress, signer) {
  if (!walletAddress) {
    console.warn("Wallet address tidak tersedia.");
    return null;
  }
  if (!signer) {
    console.warn("Signer tidak tersedia.");
    return null;
  }

  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    const battle = await contract.getBattle(walletAddress);

    const battleId = battle?.id?.toString?.() ?? "0";
    const isActive = battle?.isActive ?? false;

    // Cek apakah battle aktif: id > 0 dan isActive == true
    if (battleId !== "0" && isActive) {
      return battleId;
    }

    return null;
  } catch (error) {
    console.error("Gagal memeriksa status battle:", error);
    return null;
  }
}
