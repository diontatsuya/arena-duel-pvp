import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import { contractABI } from "../../utils/contractABI";

/**
 * Cek status battle aktif (baik PvP maupun PvE/AI)
 * @returns battleId (string) jika ada, null jika tidak sedang dalam battle
 */
export async function checkBattleStatus(walletAddress, signer) {
  if (!walletAddress || !signer) {
    console.warn("walletAddress atau signer tidak tersedia");
    return null;
  }

  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

    const battle = await contract.getBattle(walletAddress);

    // Di smart contract, battle.id adalah uint256 dan isActive adalah bool
    const battleId = battle.id?.toString?.() || "0";
    const isActive = battle.isActive;

    // Battle aktif jika: id > 0 dan isActive true
    if (isActive && battleId !== "0") {
      return battleId;
    } else {
      return null;
    }
  } catch (err) {
    console.error("Gagal memeriksa status battle:", err);
    return null;
  }
}
