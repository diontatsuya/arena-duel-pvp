// src/components/ConnectWallet.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

const ConnectWallet = ({ setSigner, setWalletAddress }) => {
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setSigner(signer);
        setWalletAddress(address);
        setIsConnected(true);
        navigate("/arena"); // pindah ke halaman arena setelah connect
      } catch (error) {
        console.error("Wallet connection error:", error);
      }
    } else {
      alert("MetaMask not detected!");
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
