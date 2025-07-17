import { useEffect, useState } from "react";
import { ethers } from "ethers";

const ConnectWallet = ({ setSigner, setWalletAddress }) => {
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" }); // minta akses wallet
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setSigner(signer);
        setWalletAddress(address);
        setIsConnected(true);
      } catch (err) {
        console.error("Error connecting wallet:", err);
        alert("Gagal menghubungkan wallet.");
      }
    } else {
      alert("MetaMask tidak terdeteksi!");
    }
  };

  return (
    <div className="mb-4">
      {isConnected ? (
        <p className="text-green-500 font-bold">Wallet Connected</p>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
