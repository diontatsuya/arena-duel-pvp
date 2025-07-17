import React, { useEffect, useState } from 'react';
import ConnectWallet from './ConnectWallet';
import { ethers } from 'ethers';
import contractABI from '../utils/contractABI.json';
import ActionButtons from './ActionButtons';
import StatusDisplay from './StatusDisplay';

const CONTRACT_ADDRESS = '0x95dd66c55214a3d603fe1657e22f710692fcbd9b';

export default function GameArena() {
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState('');
  const [contract, setContract] = useState(null);
  const [playerStatus, setPlayerStatus] = useState(null);
  const [opponentStatus, setOpponentStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (signer) {
      const gameContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      setContract(gameContract);
    }
  }, [signer]);

  const fetchStatus = async () => {
    if (!contract || !address) return;
    setIsLoading(true);
    try {
      const myStatus = await contract.getStatus(address);
      const oppAddr = await contract.players(address).then(p => p.opponent);
      let oppStatus = null;
      if (oppAddr && oppAddr !== ethers.ZeroAddress) {
        oppStatus = await contract.getStatus(oppAddr);
      }
      setPlayerStatus(myStatus);
      setOpponentStatus(oppStatus);
    } catch (err) {
      console.error("Error fetching status:", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract && address) {
      fetchStatus();
    }
  }, [contract, address]);

  const handleAction = async (actionType) => {
    if (!contract) return;
    try {
      const tx = await contract.takeTurn(actionType);
      await tx.wait();
      fetchStatus();
    } catch (err) {
      console.error("Action error:", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl text-center font-bold mb-4">Arena Duel PvP</h1>
      <ConnectWallet setSigner={setSigner} setAddress={setAddress} />
      {address && (
        <>
          <StatusDisplay
            playerStatus={playerStatus}
            opponentStatus={opponentStatus}
            isLoading={isLoading}
          />
          <ActionButtons handleAction={handleAction} />
        </>
      )}
    </div>
  );
            }
