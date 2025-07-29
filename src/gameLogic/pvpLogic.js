import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";

export const getContract = (signerOrProvider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI, signerOrProvider);
};

export const joinMatch = async (signer) => {
  try {
    const contract = getContract(signer);
    const tx = await contract.joinBattle();
    await tx.wait();
    return { success: true };
  } catch (error) {
    console.error("Join match error:", error);
    return { success: false, error };
  }
};

export const leaveMatch = async (signer) => {
  try {
    const contract = getContract(signer);
    const tx = await contract.leaveBattle();
    await tx.wait();
    return { success: true };
  } catch (error) {
    console.error("Leave match error:", error);
    return { success: false, error };
  }
};

export const getBattleStatus = async (signerOrProvider, address) => {
  try {
    const contract = getContract(signerOrProvider);
    const data = await contract.getPlayer(address);
    return {
      opponent: data.opponent,
      yourTurn: data.yourTurn,
      yourHp: data.hp.toNumber(),
      opponentHp: data.opponentHp.toNumber(),
      yourLastAction: data.lastAction,
      opponentLastAction: data.opponentLastAction,
      inBattle: data.inBattle,
    };
  } catch (error) {
    console.error("Error getBattleStatus:", error);
    return null;
  }
};

export const doAction = async (signer, actionType) => {
  try {
    const contract = getContract(signer);
    const tx = await contract.performAction(actionType);
    await tx.wait();
    return { success: true };
  } catch (error) {
    console.error("Action error:", error);
    return { success: false, error };
  }
};

export const ACTIONS = {
  ATTACK: 0,
  DEFEND: 1,
  HEAL: 2,
};
