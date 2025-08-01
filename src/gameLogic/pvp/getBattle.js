import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import { contractABI } from "../../utils/contractABI";

export const getBattle = async (walletAddress) => {
  try {
    if (!window.ethereum) throw new Error("Wallet tidak ditemukan");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

    const battleId = await contract.playerBattle(walletAddress);

    if (battleId.toString() === "0") {
      return null; // Tidak sedang dalam battle
    }

    const battle = await contract.battles(battleId);
    return {
      battleId: battleId.toString(),
      player1: battle.player1,
      player2: battle.player2,
      turn: battle.turn,
      winner: battle.winner,
      started: battle.started,
      finished: battle.finished,
      player1Health: battle.player1Health.toNumber(),
      player2Health: battle.player2Health.toNumber(),
      player1Defense: battle.player1Defense,
      player2Defense: battle.player2Defense,
    };
  } catch (error) {
    console.error("Gagal mengambil data battle:", error);
    return null;
  }
};
