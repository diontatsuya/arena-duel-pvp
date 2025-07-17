import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import contractABI from '../utils/contractABI.json';
import HealthBar from './HealthBar';

const CONTRACT_ADDRESS = '0x95dd66c55214a3d603fe1657e22f710692fcbd9b';

export default function Arena() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [playerStatus, setPlayerStatus] = useState(null);
  const [opponentStatus, setOpponentStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(false);

  // Cek jaringan dan koneksi wallet
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const prov = new ethers.BrowserProvider(window.ethereum);
        const network = await prov.getNetwork();

        if (network.chainId !== 50312) {
          alert('Please switch to Somnia Testnet (Chain ID 0xc478)');
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0xc478' }],
            });
          } catch (err) {
            console.error('Switch network failed:', err);
            return;
          }
        }

        const signer = await prov.getSigner();
        const address = await signer.getAddress();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

        setProvider(prov);
        setSigner(signer);
        setAccount(address);
        setContract(contract);
      } else {
        alert('Please install MetaMask!');
      }
    };
    init();
  }, []);

  // Ambil status player setelah koneksi sukses
  useEffect(() => {
    const fetchStatus = async () => {
      if (!contract || !account) return;
      const me = await contract.players(account);
      if (me.opponent !== ethers.ZeroAddress) {
        const opp = await contract.players(me.opponent);
        setOpponentStatus(opp);
      }
      setPlayerStatus(me);
      setIsMyTurn(me.isTurn);
    };
    fetchStatus();
  }, [contract, account]);

  const handleAction = async (action) => {
    if (!contract || !signer) return;
    setIsLoading(true);
    try {
      const tx = await contract.takeAction(action);
      await tx.wait();
      const updated = await contract.players(account);
      setPlayerStatus(updated);
      setIsMyTurn(updated.isTurn);

      if (updated.opponent !== ethers.ZeroAddress) {
        const opp = await contract.players(updated.opponent);
        setOpponentStatus(opp);
      }
    } catch (err) {
      console.error('Action failed:', err);
    }
    setIsLoading(false);
  };

  const getHpPercent = (hp) => Math.max((hp / 100) * 100, 0);

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-md max-w-xl mx-auto">
      <div className="mb-4">
        <strong>Connected:</strong> {account}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h2 className="font-bold mb-1">You</h2>
          <HealthBar hp={playerStatus?.hp || 0} />
          <p className="text-sm">Last Action: {playerStatus?.lastAction || 'None'}</p>
        </div>
        <div>
          <h2 className="font-bold mb-1">Opponent</h2>
          <HealthBar hp={opponentStatus?.hp || 0} />
          <p className="text-sm">Last Action: {opponentStatus?.lastAction || 'None'}</p>
        </div>
      </div>

      <div className="mb-4">
        <p>Current Turn: {isMyTurn ? 'Your turn!' : 'Waiting for opponent...'}</p>
      </div>

      <div className="flex justify-around">
        <button
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          onClick={() => handleAction(1)}
          disabled={!isMyTurn || isLoading}
        >
          Attack
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          onClick={() => handleAction(3)}
          disabled={!isMyTurn || isLoading}
        >
          Heal
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded"
          onClick={() => handleAction(2)}
          disabled={!isMyTurn || isLoading}
        >
          Defend
        </button>
      </div>
    </div>
  );
      }
