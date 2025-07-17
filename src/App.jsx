import React, { useEffect, useState } from 'react';
import Arena from './components/Arena';

export default function App() {
  const [wallet, setWallet] = useState(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  const somniaChainId = '0x9c42'; // Ganti jika chainId Somnia testnet berbeda

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setWallet(accounts[0]);

          const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
          setIsCorrectNetwork(currentChainId === somniaChainId);

          // Listen to network change
          window.ethereum.on('chainChanged', () => window.location.reload());
          window.ethereum.on('accountsChanged', () => window.location.reload());
        } catch (error) {
          console.error('Wallet connection failed:', error);
        }
      } else {
        alert('MetaMask tidak ditemukan. Harap instal terlebih dahulu.');
      }
    };

    connectWallet();
  }, []);

  const switchToSomnia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: somniaChainId }],
      });
    } catch (switchError) {
      console.error('Gagal switch jaringan:', switchError);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4 font-sans">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Arena Duel: PvP & PvE Turn-Based</h1>

        {!wallet ? (
          <p className="text-center text-red-600">Menghubungkan wallet...</p>
        ) : !isCorrectNetwork ? (
          <div className="text-center">
            <p className="mb-2 text-red-500">Silakan pindah ke jaringan Somnia Testnet</p>
            <button
              onClick={switchToSomnia}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Switch Jaringan
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4 text-right">Wallet: {wallet}</p>
            <Arena walletAddress={wallet} />
          </>
        )}
      </div>
    </div>
  );
            }
