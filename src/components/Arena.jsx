import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import contractABI from '../abi/ArenaDuelABI.json';

const CONTRACT_ADDRESS = '0x95dd66c55214a3d603fe1657e22f710692fcbd9b';
const TARGET_CHAIN_ID = '0xc4f8'; // Polygon Mumbai (misalnya, ubah jika beda)

export default function Arena() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [mode, setMode] = useState(null);
  const [loading, setLoading] = useState(false);

  // Inisialisasi Wallet dan jaringan
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (currentChainId !== TARGET_CHAIN_ID) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: TARGET_CHAIN_ID }],
            });
          } catch (switchError) {
            alert('Gagal ganti jaringan. Silakan ganti jaringan secara manual.');
            return;
          }
        }

        const prov = new ethers.BrowserProvider(window.ethereum);
        const signer = await prov.getSigner();
        const address = await signer.getAddress();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

        setProvider(prov);
        setSigner(signer);
        setAccount(address);
        setContract(contract);
      } catch (error) {
        console.error('Wallet connection error:', error);
      }
    } else {
      alert('Metamask tidak ditemukan');
    }
  };

  // Pantau perubahan akun dan jaringan
  useEffect(() => {
    connectWallet();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      });
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  const joinArena = async () => {
    if (!contract || !mode) {
      alert('Harap pilih mode dan pastikan wallet terkoneksi!');
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.joinArena();
      await tx.wait();
      alert('Berhasil masuk arena dalam mode ' + mode.toUpperCase());
    } catch (err) {
      console.error('Join failed:', err);
      alert('Gagal masuk arena.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white">
      {!account ? (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-yellow-500 rounded"
        >
          Connect Wallet
        </button>
      ) : (
        <div>
          <p className="mb-2">Connected as: {account}</p>
          <div className="mb-4">
            <button
              onClick={() => setMode('pvp')}
              className={`mr-2 px-4 py-2 ${mode === 'pvp' ? 'bg-blue-700' : 'bg-blue-500'} text-white rounded`}
            >
              Join PvP
            </button>
            <button
              onClick={() => setMode('ai')}
              className={`px-4 py-2 ${mode === 'ai' ? 'bg-green-700' : 'bg-green-500'} text-white rounded`}
            >
              Join vs AI
            </button>
          </div>
          {mode && (
            <button
              onClick={joinArena}
              className="px-4 py-2 bg-purple-600 text-white rounded"
              disabled={loading}
            >
              {loading ? 'Joining...' : 'Enter Arena'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
