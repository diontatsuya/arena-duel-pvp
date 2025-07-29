// src/components/ui/Navbar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [signature, setSignature] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask tidak terdeteksi");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Tanda tangan pesan
      const message = "Login to Arena Duel";
      const signedMessage = await signer.signMessage(message);

      setWalletAddress(address);
      setSignature(signedMessage);
      console.log("Wallet:", address);
      console.log("Signature:", signedMessage);
    } catch (err) {
      console.error("Gagal koneksi wallet:", err);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setSignature(null);
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/">Arena Duel</Link>
      </div>
      <div className="flex space-x-4 items-center">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/join-pvp" className="hover:underline">
          Join PvP
        </Link>
        <Link to="/arena-pvp" className="hover:underline">
          Arena PvP
        </Link>
        <Link to="/arena-pve" className="hover:underline">
          Arena PvE
        </Link>
        {walletAddress ? (
          <div className="flex items-center space-x-2">
            <span className="text-green-400">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
            <button
              onClick={disconnectWallet}
              className="text-red-400 hover:underline"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
          >
            Hubungkan Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
