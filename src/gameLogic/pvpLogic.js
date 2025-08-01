import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";

// Fungsi untuk mengecek apakah pemain sudah matched
export const checkIfMatched = async (playerAddress) => {
  if (!window.ethereum || !playerAddress) return false;

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

  try {
    const battle = await contract.getBattle(playerAddress);

    // Jika ada lawan (opponent address bukan address kosong), artinya sudah matched
    const hasOpponent = battle.player1 !== ethers.constants.AddressZero &&
                        battle.player2 !== ethers.constants.AddressZero;

    return hasOpponent;
  } catch (error) {
    console.error("Gagal mengambil data battle:", error);
    return false;
  }
};
