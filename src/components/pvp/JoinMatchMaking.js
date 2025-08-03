import { ethers } from "ethers";
import { contractAddress, contractABI } from "../../utils/contractInfo";

export const joinMatchmaking = async (signer) => {
  try {
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const tx = await contract.joinMatchmaking();
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Gagal join matchmaking:", error);
    return false;
  }
};
