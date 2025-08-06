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
    const battleId = await contract.getPlayerBattle(walletAddress);

    if (battleId && battleId > 0n) {
      return battleId.toString();
    } else {
      return null;
    }
  } catch (err) {
    console.error("Gagal memeriksa status battle:", err);
    return null;
  }
}
