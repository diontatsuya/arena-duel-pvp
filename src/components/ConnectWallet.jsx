import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

export default function ConnectWallet({ setSigner, setAddress }) {
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      // Sign a message for Somnia login
      const message = "Sign this message to login to Somnia Testnet";
      await signer.signMessage(message);

      setSigner(signer);
      setAddress(userAddress);
      setIsConnected(true);
    } else {
      alert("Please install MetaMask to connect your wallet.");
    }
  };

  useEffect(() => {
    // Auto connect if already authorized
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
        if (accounts.length > 0) {
          setIsConnected(true);
          const provider = new ethers.BrowserProvider(window.ethereum);
          provider.getSigner().then(s => {
            setSigner(s);
            s.getAddress().then(setAddress);
          });
        }
      });
    }
  }, []);

  return (
    <div className="text-center my-4">
      <button
        onClick={connectWallet}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
      >
        {isConnected ? "Wallet Connected" : "Connect Wallet"}
      </button>
    </div>
  );
}
