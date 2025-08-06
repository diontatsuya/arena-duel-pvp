import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import { contractABI } from "../../utils/contractABI";
import { useWallet } from "../../context/WalletContext"; // pastikan path-nya sesuai

export const useJoinMatchmaking = () => {
  const { signer } = useWallet();

  const joinMatchmaking = async () => {
    if (!signer) {
      console.error("Signer tidak tersedia");
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
