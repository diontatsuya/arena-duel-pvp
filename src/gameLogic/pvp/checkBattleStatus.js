import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import { contractABI } from "../../utils/contractABI";

export async function checkBattleStatus(walletAddress, signer) {
  if (!walletAddress || !signer) {
    console.warn("walletAddress atau signer tidak tersedia");
    return null;
  }

  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    const battle = await contract.getBattle(walletAddress);

    // Periksa apakah battle valid berdasarkan isActive atau nilai id
    if (battle.isActive && battle.id && battle.id > 0n) {
      return battle.id.toString();
    } else {
      return null;
    }
  } catch (err) {
    console.error("Gagal memeriksa status battle (real user):", err);
    return null;
  }
}
