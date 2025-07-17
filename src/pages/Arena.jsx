import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import contractABI from '../utils/contractABI.json';
import HealthBar from '../components/HealthBar';

const CONTRACT_ADDRESS = '0x95dd66c55214a3d603fe1657e22f710692fcbd9b'; // Sesuaikan jika berubah
const SOMNIA_CHAIN_ID = 50312; // Chain ID Somnia Testnet

const Arena = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [status, setStatus] = useState('');
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (parseInt(chainId, 16) !== SOMNIA_CHAIN_ID) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0xc4f8' }], // Hexadecimal 50312
            });
          } catch (switchError) {
            setStatus('Gagal mengganti jaringan ke Somnia Testnet.');
            return;
          }
        }

        const accs = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const prov = new ethers.BrowserProvider(window.ethereum);
        const sign = await prov.getSigner();
        const cont = new ethers.Contract(CONTRACT_ADDRESS, contractABI, sign);

        setProvider(prov);
        setSigner(sign);
        setContract(cont);
        setAccount(accs[0]);
        setStatus('Wallet terhubung.');
      } catch (err) {
        console.error(err);
        setStatus('Gagal menghubungkan wallet.');
      }
    } else {
      setStatus('Metamask tidak ditemukan.');
    }
  };

  const joinArena = async () => {
    if (!contract) return;
    try {
      const tx = await contract.joinArena();
      setStatus('Menunggu konfirmasi transaksi...');
      setActionInProgress(true);
      await tx.wait();
      setStatus('Berhasil masuk ke arena.');
      fetchPlayerData();
    } catch (err) {
      console.error(err);
      setStatus('Gagal masuk ke arena.');
    } finally {
      setActionInProgress(false);
    }
  };

  const fetchPlayerData = async () => {
    if (!contract || !account) return;
    try {
      const data = await contract.players(account);
      setPlayer(data);

      if (data.opponent !== ethers.ZeroAddress) {
        const oppData = await contract.players(data.opponent);
        setOpponent(oppData);
      } else {
        setOpponent(null);
      }
    } catch (err) {
      console.error(err);
      setStatus('Gagal mengambil data pemain.');
    }
  };

  const performAction = async (actionType) => {
    if (!contract) return;
    try {
      let tx;
      if (actionType === 'attack') tx = await contract.attack();
      else if (actionType === 'defend') tx = await contract.defend();
      else if (actionType === 'heal') tx = await contract.heal();
      else return;

      setStatus('Aksi dikirim, menunggu konfirmasi...');
      setActionInProgress(true);
      await tx.wait();
      setStatus(`Aksi ${actionType} berhasil.`);
      fetchPlayerData();
    } catch (err) {
      console.error(err);
      setStatus(`Gagal melakukan aksi ${actionType}.`);
    } finally {
      setActionInProgress(false);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (contract && account) {
      fetchPlayerData();
    }
  }, [contract, account]);

  return (
    <div className="p-4 max-w-xl mx-auto text-center bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-4">⚔️ Arena Duel</h1>
      <p className="mb-2">{status}</p>
      {!player || player.hp === 0 ? (
        <button
          onClick={joinArena}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={actionInProgress}
        >
          Join Arena
        </button>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h2 className="font-semibold mb-1">👤 Kamu</h2>
              <HealthBar hp={player.hp} />
              <p className="text-sm text-gray-600">{player.isTurn ? '🎯 Giliranmu' : '⏳ Menunggu'}</p>
              <p className="text-sm text-gray-500 italic">Last: {player.lastAction}</p>
            </div>
            {opponent ? (
              <div>
                <h2 className="font-semibold mb-1">👾 Lawan</h2>
                <HealthBar hp={opponent.hp} />
                <p className="text-sm text-gray-600">{!player.isTurn ? '🎯 Giliran lawan' : '⏳ Menunggu'}</p>
                <p className="text-sm text-gray-500 italic">Last: {opponent.lastAction}</p>
              </div>
            ) : (
              <div>
                <h2 className="font-semibold">Menunggu lawan...</h2>
              </div>
            )}
          </div>
          {player.isTurn && (
            <div className="flex justify-center gap-4">
              <button
                onClick={() => performAction('attack')}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                disabled={actionInProgress}
              >
                Attack
              </button>
              <button
                onClick={() => performAction('defend')}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                disabled={actionInProgress}
              >
                Defend
              </button>
              <button
                onClick={() => performAction('heal')}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                disabled={actionInProgress}
              >
                Heal
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Arena;
