import { ethers } from "ethers";
import { contractABI } from "../../utils/contractABI";
import { CONTRACT_ADDRESS } from "../../utils/constants";

export async function getBattle(signer) {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    const battle = await contract.getMyBattle();

    return {
      player1: battle.player1,
      player2: battle.player2,
      player1HP: battle.player1HP,
      player2HP: battle.player2HP,
      lastActionPlayer1: battle.lastActionPlayer1,
      lastActionPlayer2: battle.lastActionPlayer2,
      isPlayer1Turn: battle.isPlayer1Turn,
      isActive: battle.isActive,
      resultPlayer1: battle.resultPlayer1,
      resultPlayer2: battle.resultPlayer2,
      status: battle.isActive ? 0 : 1 // kamu bisa ubah logika status sesuai kebutuhan
    };
  } catch (error) {
    console.error("Gagal fetch data pemain:", error);
    return null;
  }
};
