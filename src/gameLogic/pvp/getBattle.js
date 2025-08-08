import { ethers } from "ethers";
import { contractAddress, contractABI } from "../../contracts/contract";

export const getBattle = async (signer, walletAddress) => {
  try {
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const battle = await contract.getMyBattle(); // Ganti ini, bukan `players()` lagi

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
