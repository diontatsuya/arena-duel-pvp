import { ethers } from "ethers";
import { contractABI } from "../../utils/contractABI";
import { CONTRACT_ADDRESS } from "../../utils/constants";

// Cek apakah battle ditemukan untuk player tertentu
export const checkIfMatched = async (playerAddress) => {
  try {
    if (!window.ethereum || !playerAddress) return false;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

    // Ambil battleId berdasarkan alamat player
    const battleId = await contract.activeBattleId(playerAddress);
    if (battleId.toString() === "0") return false;

    // Ambil data battle
    const battle = await contract.battles(battleId);
    const player1 = battle.player1.toLowerCase();
    const player2 = battle.player2.toLowerCase();

    const zeroAddr = ethers.constants.AddressZero.toLowerCase();

    // Cek apakah kedua player sudah ada di battle
    return player1 !== zeroAddr && player2 !== zeroAddr;
  } catch (error) {
    console.error("❌ Gagal mengecek match:", error);
    return false;
  }
};
