import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import { contractABI } from "../../utils/contractABI";

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

  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    let tx;

    if (actionType === "attack") {
      tx = await contract.attack();
    } else if (actionType === "defend") {
      tx = await contract.defend();
    } else if (actionType === "heal") {
      tx = await contract.heal();
    } else {
      console.warn("Aksi tidak dikenali:", actionType);
      return;
    }

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
