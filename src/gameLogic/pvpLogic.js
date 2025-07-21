import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

export const getContract = async () => {
  if (!window.ethereum) return null;

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
};

export const getPlayerStatus = async (contract, playerAddress) => {
  try {
    const status = await contract.players(playerAddress);
    return {
      hp: status.hp.toNumber(),
      opponent: status.opponent,
      isTurn: status.isTurn,
      lastAction: status.lastAction,
    };
  } catch (err) {
    console.error("Failed to get player status:", err);
    return null;
  }
};

export const performAction = async (contract, actionIndex) => {
  try {
    const tx = await contract.performAction(actionIndex);
    await tx.wait();
    return tx.hash;
  } catch (err) {
    console.error("Action failed:", err);
    return null;
  }
};
