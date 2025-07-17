import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import contractABI from '../abi/ArenaDuelABI.json';
import HealthBar from '../components/HealthBar';
import { getActionName } from '../utils/helpers';

const CONTRACT_ADDRESS = '0x95dd66c55214a3d603fe1657e22f710692fcbd9b';

export default function Arena() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [mode, setMode] = useState(null);
  const [playerStatus, setPlayerStatus] = useState(null);
  const [opponentStatus, setOpponentStatus] = useState(null);
  const [turn, setTurn] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
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
    const tx = await contract.joinArena();
    await tx.wait();
    setMessage(`Joined arena in ${mode.toUpperCase()} mode!`);
    fetchStatus();
  };

  const fetchStatus = async () => {
    if (!contract || !account) return;
    const player = await contract.players(account);
    if (player.opponent !== ethers.ZeroAddress) {
      const opponent = await contract.players(player.opponent);
      setOpponentStatus(opponent);
    }
    setPlayerStatus(player);
    setTurn(player.isTurn);
  };

  const performAction = async (actionCode) => {
    if (!contract || !turn || actionLoading) return;
    setActionLoading(true);
    try {
      const tx = await contract.performAction(actionCode);
      await tx.wait();
      setMessage(`You chose to ${getActionName(actionCode)}!`);
      fetchStatus();
    } catch (err) {
      console.error(err);
      setMessage('Action failed.');
    }
    setActionLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Arena Duel</h1>
      <p className="mb-2">Connected as: {account}</p>

      {!mode && (
        <div className="mb-4">
          <button onClick={() => setMode('pvp')} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded">Join PvP</button>
          <button onClick={() => setMode('ai')} className="px-4 py-2 bg-green-500 text-white rounded">Join vs AI</button>
        </div>
      )}

      {mode && !playerStatus && (
        <button onClick={joinArena} className="px-4 py-2 bg-purple-600 text-white rounded">Enter Arena</button>
      )}

      {playerStatus && (
        <div className="mt-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Your Status</h2>
            <HealthBar hp={Number(playerStatus.hp)} />
            <p>Last Action: {getActionName(playerStatus.lastAction)}</p>
          </div>

          {opponentStatus && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Opponent Status</h2>
              <HealthBar hp={Number(opponentStatus.hp)} />
              <p>Last Action: {getActionName(opponentStatus.lastAction)}</p>
            </div>
          )}

          <div className="mt-4">
            <h3 className="text-lg mb-2">Choose Your Action</h3>
            <button
              onClick={() => performAction(1)}
              disabled={!turn || actionLoading}
              className="mr-2 px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
            >
              Attack
            </button>
            <button
              onClick={() => performAction(2)}
              disabled={!turn || actionLoading}
              className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded disabled:opacity-50"
            >
              Defend
            </button>
            <button
              onClick={() => performAction(3)}
              disabled={!turn || actionLoading}
              className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
            >
              Heal
            </button>
          </div>

          {message && <p className="mt-4 text-purple-600 font-semibold">{message}</p>}
        </div>
      )}
    </div>
  );
}
