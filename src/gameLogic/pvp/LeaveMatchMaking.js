import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import { contractABI } from "../../utils/contractABI";
import { useWallet } from "../../context/WalletContext";

export const useLeaveMatchmaking = () => {
  const { signer } = useWallet();

  const leaveMatchmaking = async () => {
    if (!signer) {
      console.error("Signer tidak tersedia");
      return false;
    }

    try {
      const playerAddress = await signer.getAddress();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      // Jika fungsi kontrak menerima address sebagai parameter:
      // const tx = await contract.leaveMatchmaking(playerAddress);

      // Jika tidak menerima parameter:
      const tx = await contract.leaveMatchmaking();

      await tx.wait();
      return true;
    } catch (error) {
      console.error("Gagal leave matchmaking:", error);
      return false;
    }
  };

  return { leaveMatchmaking };
};
