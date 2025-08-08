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
    
    // Cek sebagai player1 (langsung dari mapping)
    const battle = await contract.getBattle(walletAddress);
    if (battle.isActive && battle.id && battle.id > 0n) {
      return battle.id.toString();
    }

    // Jika belum ditemukan, cek apakah wallet ini adalah player2
    const totalBattles = await contract.totalBattles();
    for (let i = 1; i <= totalBattles; i++) {
      const b = await contract.battles(i);
      if (b.isActive && b.player2.toLowerCase() === walletAddress.toLowerCase()) {
        return b.id.toString();
      }
    }

    return null;
  } catch (err) {
    console.error("Gagal memeriksa status battle:", err);
    return null;
  }
}
