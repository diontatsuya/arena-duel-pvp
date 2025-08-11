import { ethers } from "ethers";
import { contractABI } from "../../utils/contractABI";
import { CONTRACT_ADDRESS } from "../../utils/constants";

export async function getBattle(signer, battleId) {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    const battle = await contract.getBattle(battleId);

    const zeroAddr = ethers.constants.AddressZero.toLowerCase();

    return {
      player1: battle.player1.toLowerCase(),
      player2: battle.player2.toLowerCase(),
      player1HP: battle.player1HP,
      player2HP: battle.player2HP,
      lastActionPlayer1: battle.lastActionPlayer1,
      lastActionPlayer2: battle.lastActionPlayer2,
      isPlayer1Turn: battle.isPlayer1Turn,
      isActive: battle.isActive,
      resultPlayer1: battle.resultPlayer1,
      resultPlayer2: battle.resultPlayer2,
      // status 0 = masih matchmaking (player2 kosong), 1 = sudah match atau selesai
      status:
        battle.isActive && battle.player2.toLowerCase() === zeroAddr
          ? 0
          : 1,
    };
  } catch (error) {
    console.error("Gagal fetch data battle:", error);
    return null;
  }
}
