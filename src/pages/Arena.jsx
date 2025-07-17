import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import contractABI from '../utils/contractABI.json';

const CONTRACT_ADDRESS = '0x95dd66c55214a3d603fe1657e22f710692fcbd9b'; // Ganti jika berubah

const Arena = () => {
  const [status, setStatus] = useState('');
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [isTurn, setIsTurn] = useState(false);
  const [lastAction, setLastAction] = useState('');
  const [selectedAction, setSelectedAction] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) {
        setStatus('Silakan instal MetaMask.');
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const network = await provider.getNetwork();

      // Cek jika bukan jaringan Somnia, minta ganti jaringan
      if (network.chainId !== 50312) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xC4F8' }], // 50312 = 0xC4F8
          });
          return; // Tunggu user switch, lalu refresh halaman
        } catch (error) {
          setStatus('Gagal switch ke jaringan Somnia. Silakan ubah jaringan secara manual.');
          return;
        }
      }

      const arenaContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      setContract(arenaContract);

      const userAddress = await signer.getAddress();
      const playerData = await arenaContract.players(userAddress);

      if (playerData.opponent !== ethers.constants.AddressZero) {
        const opponentData = await arenaContract.players(playerData.opponent);
        setOpponent(opponentData);
      }

      setPlayer(playerData);
      setIsTurn(playerData.isTurn);
      setLastAction(ActionToText(playerData.lastAction));

      arenaContract.on('ActionTaken', (playerAddr, opponentAddr, action) => {
        if (playerAddr === userAddress || opponentAddr === userAddress) {
          setStatus(`Aksi: ${ActionToText(action)}`);
        }
      });

      arenaContract.on('GameOver', (winner, loser) => {
        if (winner === userAddress) {
          setStatus('Kamu menang!');
        } else if (loser === userAddress) {
          setStatus('Kamu kalah!');
        } else {
          setStatus('Permainan selesai.');
        }
      });
    };

    init();
  }, []);

  const ActionToText = (action) => {
    switch (action) {
      case 1:
        return 'Attack';
      case 2:
        return 'Defend';
      case 3:
        return 'Heal';
      default:
        return 'None';
    }
  };

  const handleJoin = async () => {
    if (!contract) return;
    setStatus('Menunggu lawan...');
    const tx = await contract.joinGame();
    await tx.wait();
    setStatus('Berhasil bergabung.');
  };

  const handleAction = async () => {
    if (!contract || selectedAction === null) return;
    setStatus('Mengirim aksi...');
    const tx = await contract.takeAction(selectedAction);
    await tx.wait();
    setStatus('Aksi berhasil dikirim.');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-4">Arena Duel (Turn-Based)</h1>

      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <p>Status: {status}</p>
        <p>HP Kamu: {player?.hp ?? '-'}</p>
        <p>HP Lawan: {opponent?.hp ?? '-'}</p>
        <p>Gantianmu: {isTurn ? 'Ya' : 'Tidak'}</p>
        <p>Aksi Terakhir: {lastAction}</p>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleJoin}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Join Game
        </button>

        <select
          value={selectedAction ?? ''}
          onChange={(e) => setSelectedAction(Number(e.target.value))}
          className="text-black px-2 py-1 rounded"
        >
          <option value="">Pilih Aksi</option>
          <option value="1">Attack</option>
          <option value="2">Defend</option>
          <option value="3">Heal</option>
        </select>

        <button
          onClick={handleAction}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Kirim Aksi
        </button>
      </div>
    </div>
  );
};

export default Arena;
