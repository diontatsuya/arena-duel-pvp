import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import contractABI from '../utils/contractABI.json';
import HealthBar from '../components/HealthBar';

const CONTRACT_ADDRESS = '0x95dd66c55214a3d603fe1657e22f710692fcbd9b';

const Arena = () => {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(false);
  const [status, setStatus] = useState('');
  const [chainIdValid, setChainIdValid] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await web3Provider.getSigner();
        const address = await signer.getAddress();
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

        const { chainId } = await web3Provider.getNetwork();
        if (chainId !== 50312) {
          setChainIdValid(false);
          return;
        }

        setProvider(web3Provider);
        setAccount(address);
        setContract(contractInstance);
        loadPlayerData(contractInstance, address);
      }
    };
    init();
  }, []);

  const loadPlayerData = async (contract, address) => {
    try {
      const p = await contract.players(address);
      setPlayer(p);
      if (p.opponent && p.opponent !== ethers.ZeroAddress) {
        const o = await contract.players(p.opponent);
        setOpponent(o);
      }
      setCurrentTurn(p.isTurn);
    } catch (err) {
      console.error('Error loading player:', err);
    }
  };

  const handleJoin = async () => {
    try {
      const tx = await contract.joinArena();
      setStatus('Joining arena...');
      await tx.wait();
      setStatus('Joined! Waiting for opponent...');
      loadPlayerData(contract, account);
    } catch (err) {
      console.error(err);
      setStatus('Failed to join arena');
    }
  };

  const handleAction = async (action) => {
    try {
      const tx = await contract.takeAction(action);
      setStatus('Performing action...');
      await tx.wait();
      setStatus('Action performed!');
      loadPlayerData(contract, account);
    } catch (err) {
      console.error(err);
      setStatus('Action failed');
    }
  };

  if (!chainIdValid) {
    return <div>Please switch to Somnia Testnet (Chain ID: 50312)</div>;
  }

  return (
    <div className="p-4 text-white">
      <h1 className="text-3xl font-bold mb-4">Arena Duel PvP (Turn-Based)</h1>
      <p>Connected as: {account}</p>

      {!player || player.hp === 0 ? (
        <button onClick={handleJoin} className="bg-blue-600 px-4 py-2 rounded mt-4">
          Join Arena
        </button>
      ) : (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Your Status</h2>
          <HealthBar hp={player.hp} />
          <p>Last Action: {['None', 'Attack', 'Defend', 'Heal'][player.lastAction]}</p>

          {opponent && (
            <>
              <h2 className="text-xl font-semibold mt-4">Opponent Status</h2>
              <HealthBar hp={opponent.hp} />
              <p>Last Action: {['None', 'Attack', 'Defend', 'Heal'][opponent.lastAction]}</p>
            </>
          )}

          {currentTurn ? (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Your Turn!</h3>
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleAction(1)} className="bg-red-600 px-4 py-2 rounded">Attack</button>
                <button onClick={() => handleAction(2)} className="bg-yellow-600 px-4 py-2 rounded">Defend</button>
                <button onClick={() => handleAction(3)} className="bg-green-600 px-4 py-2 rounded">Heal</button>
              </div>
            </div>
          ) : (
            <p className="mt-4">Waiting for opponent's turn...</p>
          )}
        </div>
      )}
      {status && <p className="mt-4 text-sm">{status}</p>}
    </div>
  );
};

export default Arena;
