import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from './constants.js';
import { contractABI } from './contractABI.js';

export const getReadContract = (provider) => new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
export const getWriteContract = (signer) => new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
