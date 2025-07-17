import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import contractABI from '../abi/ArenaDuelABI.json';
import HealthBar from '../components/HealthBar';
import { checkAndSwitchNetwork } from '../utils/network';

const CONTRACT_ADDRESS = '0x95dd66c55214a3d603fe1657e22f710692fcbd9b';

export default function Arena() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [mode, setMode] = useState(null);
  const [playerHP, setPlayerHP] = useState(100);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        await checkAndSwitchNetwork();
        const prov = new ethers.BrowserProvider(window.ethereum);
        const signer = await prov.getSigner();
        const address = await signer.getAddress();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

        setProvider(prov);
        setSigner(signer);
        setAccount(address);
        setContract(contract);
      }
    };
    init();
  }, []);

  const joinArena = async () => {
    if (!contract || !mode) return;
    try {
      const tx = await contract.joinArena();
      await tx.wait();
      alert('Joined arena in ' + mode.toUpperCase() + ' mode!');
    } catch (error) {
      console.error(error);
      alert('Gagal join arena');
    }
  };

  return (
    <div className="p-4">
      <p className="mb-4 text-sm">Connected as: {account}</p>

      <HealthBar currentHP={playerHP} maxHP={100} />

      <div className="my-4">
        <button onClick={() => setMode('pvp')} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded">
          Join PvP
        </button>
        <button onClick={() => setMode('ai')} className="px-4 py-2 bg-green-500 text-white rounded">
          Join vs AI
        </button>
      </div>

      {mode && (
        <button
          onClick={joinArena}
          className="px-4 py-2 bg-purple-600 text-white rounded"
        >
          Enter Arena
        </button>
      )}
    </div>
  );
}
