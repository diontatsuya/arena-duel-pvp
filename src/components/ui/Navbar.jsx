import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [signature, setSignature] = useState(null);

  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    const savedSignature = localStorage.getItem("signature");

    if (savedAddress && savedSignature) {
      setWalletAddress(savedAddress);
      setSignature(savedSignature);
    }
  }, []);

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

      let signedMessage = localStorage.getItem("signature");
      if (!signedMessage) {
        const message = "Login to Arena Duel";
        signedMessage = await signer.signMessage(message);
        localStorage.setItem("signature", signedMessage);
      }

      setWalletAddress(address);
      setSignature(signedMessage);
      localStorage.setItem("walletAddress", address);
    } catch (err) {
      console.error("Gagal koneksi wallet:", err);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setSignature(null);
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("signature");
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="text-xl font-bold text-white">
        <Link to="/">Arena Duel</Link>
      </div>
      <div className="flex space-x-4 items-center">
        <Link to="/" className="text-white hover:underline">
          Home
        </Link>
        <Link to="/join-pvp" className="text-white hover:underline">
          Join PvP
        </Link>
        <Link to="/arena-pvp" className="text-white hover:underline">
          Arena PvP
        </Link>
        <Link to="/arena-pve" className="text-white hover:underline">
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
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white"
          >
            Hubungkan Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
