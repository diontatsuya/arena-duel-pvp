import { ethers } from "ethers";
import { contractABI } from "../../utils/contractABI";
import { CONTRACT_ADDRESS } from "../../utils/constants";

// Cek apakah battle ditemukan untuk player tertentu
export const checkIfMatched = async (playerAddress) => {
  try {
    if (!window.ethereum || !playerAddress) return false;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

    const battleId = await contract.getPlayerBattle(playerAddress);
    const battle = await contract.battles(battleId);

    const player1 = battle.player1.addr.toLowerCase();
    const player2 = battle.player2.addr.toLowerCase();

    const zeroAddr = ethers.constants.AddressZero;

    const matched = player1 !== zeroAddr && player2 !== zeroAddr;

    return matched;
  } catch (error) {
    console.error("❌ Gagal mengecek match:", error);
    return false;
  }
};
