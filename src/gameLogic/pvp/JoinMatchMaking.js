import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import { contractABI } from "../../utils/contractABI";
import { useWallet } from "../../context/WalletContext";

export const useJoinMatchmaking = () => {
  const { signer } = useWallet(); // signer dari real user

  const joinMatchmaking = async () => {
    if (!signer) {
      console.error("Signer tidak tersedia. Pastikan wallet sudah terkoneksi.");
      return false;
    }

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.joinMatchmaking();
      await tx.wait();
      return true;
    } catch (error) {
      console.error("Gagal join matchmaking:", error);
      return false;
    }
  };

  return { joinMatchmaking };
};
