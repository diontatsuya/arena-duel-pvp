import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import { contractABI } from "../../utils/contractABI";

/**
 * Ambil data battle user saat ini
 * @param {ethers.Signer} signer 
 * @returns {Promise<Object|null>} objek battle, null jika tidak ada battle aktif
 */
export const getMyBattle = async (signer) => {
  if (!signer) return null;

  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    const battle = await contract.getMyBattle();

    if (!battle.isActive) return null;

    // Format battle agar lebih mudah dipakai frontend
    return {
      player1: battle.player1,
      player2: battle.player2,
      player1HP: battle.player1HP.toNumber(),
      player2HP: battle.player2HP.toNumber(),
      lastActionPlayer1: battle.lastActionPlayer1,
      lastActionPlayer2: battle.lastActionPlayer2,
      isPlayer1Turn: battle.isPlayer1Turn,
      isActive: battle.isActive,
      resultPlayer1: battle.resultPlayer1,
      resultPlayer2: battle.resultPlayer2,
    };
  } catch (error) {
    console.error("getMyBattle error:", error);
    return null;
  }
};

/**
 * Kirim aksi dalam battle (attack/defend/heal)
 * @param {ethers.Signer} signer 
 * @param {number} action enum: 0=attack,1=defend,2=heal
 * @returns {Promise<boolean>} true jika sukses, false jika gagal
 */
export const takeAction = async (signer, action) => {
  if (!signer) return false;

  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    const tx = await contract.takeAction(action);
    await tx.wait();
    return true;
  } catch (error) {
    console.error("takeAction error:", error);
    return false;
  }
};

/**
 * Join matchmaking
 * @param {ethers.Signer} signer 
 * @returns {Promise<boolean>} true jika sukses
 */
export const joinMatchmaking = async (signer) => {
  if (!signer) return false;

  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    const tx = await contract.joinMatchmaking();
    await tx.wait();
    return true;
  } catch (error) {
    console.error("joinMatchmaking error:", error);
    return false;
  }
};

/**
 * Leave matchmaking
 * @param {ethers.Signer} signer 
 * @returns {Promise<boolean>} true jika sukses
 */
export const leaveMatchmaking = async (signer) => {
  if (!signer) return false;

  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    const tx = await contract.leaveMatchmaking();
    await tx.wait();
    return true;
  } catch (error) {
    console.error("leaveMatchmaking error:", error);
    return false;
  }
};

/**
 * Leave battle aktif
 * @param {ethers.Signer} signer 
 * @returns {Promise<boolean>} true jika sukses
 */
export const leaveBattle = async (signer) => {
  if (!signer) return false;

  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    const tx = await contract.leaveBattle();
    await tx.wait();
    return true;
  } catch (error) {
    console.error("leaveBattle error:", error);
    return false;
  }
};
