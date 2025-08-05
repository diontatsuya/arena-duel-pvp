import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import { contractABI } from "../../utils/contractABI";

/**
 * Mapping aksi ke enum uint8 di smart contract
 */
const actionMap = {
  attack: 0,
  defend: 1,
  heal: 2,
};

/**
 * Menjalankan aksi battle berdasarkan tipe (attack, defend, heal)
 * @param {string} actionType - "attack", "defend", atau "heal"
 * @param {ethers.Signer} signer - Signer wallet yang sudah terhubung
 * @param {Function} refreshBattleData - Fungsi untuk memperbarui data battle setelah aksi
 */
export const handleAction = async (actionType, signer, refreshBattleData) => {
  if (!signer) {
    alert("Wallet belum terhubung");
    return;
  }

  const actionCode = actionMap[actionType];

  if (actionCode === undefined) {
    console.warn("Aksi tidak valid:", actionType);
    return;
  }

  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    const tx = await contract.takeAction(actionCode);

    console.log("Transaction Method Data :>>", tx.data);
    await tx.wait();
    console.log("Transaksi berhasil:", tx.hash);

    // Refresh data setelah aksi selesai
    if (refreshBattleData) {
      await refreshBattleData();
    }
  } catch (err) {
    console.error("Gagal menjalankan aksi:", err);
    alert("Gagal menjalankan aksi: " + (err?.message || err));
  }
};
