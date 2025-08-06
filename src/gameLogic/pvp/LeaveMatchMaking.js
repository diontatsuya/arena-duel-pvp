import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import { contractABI } from "../../utils/contractABI";
import { getSignerFromContext } from "../../utils/getSignerFromContext";

export const leaveMatchmaking = async () => {
  try {
    const signer = getSignerFromContext();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
    const tx = await contract.leaveMatchmaking();
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Gagal leave matchmaking:", error);
    return false;
  }
};
