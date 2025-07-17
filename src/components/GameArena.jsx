import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import contractABI from '../utils/contractABI.json';
import HealthBar from './HealthBar';
import ActionButton from './ActionButtons';
import StatusDisplay from './StatusDisplay';

const CONTRACT_ADDRESS = '0x95dd66c55214a3d603fe1657e22f710692fcbd9b';

export default function GameArena() {
  const [wallet, setWallet] = useState('');
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [status, setStatus] = useState(null);
  const [opponentStatus, setOpponentStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const selectedAddress = accounts[0];
      setWallet(selectedAddress);
      const prov = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(prov);
      const signer = prov.getSigner();
      const instance = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      setContract(instance);
    }
  };

  const fetchStatus = async () => {
    if (!contract || !wallet) return;
    const s = await contract.getStatus(wallet);
    setStatus(s);
    if (s.opponent !== ethers.constants.AddressZero) {
      const o = await contract.getStatus(s.opponent);
      setOpponentStatus(o);
    } else {
      setOpponentStatus(null);
    }
  };

  const handleAction = async (action) => {
    if (!contract) return;
    setIsLoading(true);
    try {
      const tx = await contract.takeTurn(action);
      await tx.wait();
      await fetchStatus();
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (wallet && contract) fetchStatus();
  }, [wallet, contract]);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Arena Duel PvP</h1>
      {!wallet ? (
        <button
          onClick={connectWallet}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full"
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <div className="my-6">
            <h2 className="text-xl mb-2">Your Status</h2>
            <HealthBar hp={status?.hp || 0} />
            <StatusDisplay status={status} address={wallet} />
          </div>
          {opponentStatus && (
            <div className="my-6">
              <h2 className="text-xl mb-2">Opponent Status</h2>
              <HealthBar hp={opponentStatus.hp} />
              <StatusDisplay status={opponentStatus} address={status.opponent} />
            </div>
          )}
          <div className="mt-8 space-x-4">
            {[1, 2, 3].map((a) => (
              <ActionButton key={a} action={a} onAction={handleAction} disabled={isLoading || !status?.isTurn} />
            ))}
          </div>
          <p className="mt-4 text-sm opacity-80">Waiting for your turn or opponent...</p>
        </>
      )}
    </div>
  );
}
