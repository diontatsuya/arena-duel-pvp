import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import { contractABI } from "../../utils/contractABI";
import { useWallet } from "../../context/WalletContext";

export const useJoinMatchmaking = () => {
  const { signer } = useWallet();

  const joinMatchmaking = async () => {
    if (!signer) {
      console.error("Signer tidak tersedia. Pastikan wallet sudah terkoneksi.");
      return null;
    }

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      // Join matchmaking
      const tx = await contract.joinMatchmaking();
      await tx.wait();

      // Ambil address user
      const address = await signer.getAddress();

      // Tunggu sampai matchmaking selesai (opsional: polling atau delay singkat)
      let battleId = 0;
      let retries = 0;
      while (battleId === 0 && retries < 10) {
        battleId = await contract.activeBattleId(address);
        if (battleId.toString() !== "0") break;
        await new Promise((resolve) => setTimeout(resolve, 1000)); // tunggu 1 detik
        retries++;
      }

      if (battleId.toString() === "0") {
        console.warn("Belum menemukan lawan, harap tunggu matchmaking selesai.");
        return null;
      }

      return battleId.toString();
    } catch (error) {
      console.error("Gagal join matchmaking:", error);
      return null;
    }
  };

  return { joinMatchmaking };
};
