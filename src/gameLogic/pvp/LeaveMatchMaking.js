import { ethers } from "ethers";
import { contractAddress, contractABI } from "../../utils/contractInfo";

export const leaveMatchmaking = async (signer) => {
  try {
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const tx = await contract.leaveMatchmaking();
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Gagal leave matchmaking:", error);
    return false;
  }
};
