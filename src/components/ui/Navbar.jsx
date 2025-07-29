import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";

const SOMNIA_CHAIN_ID = 50312;

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [signature, setSignature] = useState(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask tidak terdeteksi");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const sig = await signer.signMessage("Login to Arena Duel");

      const network = await provider.getNetwork();
      if (network.chainId !== SOMNIA_CHAIN_ID) {
        setIsCorrectNetwork(false);
        alert("Harap ganti ke jaringan Somnia Testnet.");
        return;
      }

      setWalletAddress(address);
      setSignature(sig);
      setIsCorrectNetwork(true);

      console.log("Signed in:", address, sig);
    } catch (error) {
      console.error("Gagal menghubungkan wallet:", error);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setSignature(null);
    setIsCorrectNetwork(true);
  };

  const checkNetworkOnLoad = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      if (network.chainId !== SOMNIA_CHAIN_ID) {
        setIsCorrectNetwork(false);
      } else {
        setIsCorrectNetwork(true);
      }
    }
  };

  useEffect(() => {
    checkNetworkOnLoad();

    // Optional: listen for network change
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload(); // reload untuk memicu ulang pengecekan jaringan
      });
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, []);

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
            <span
              className={`${
                isCorrectNetwork ? "text-green-400" : "text-yellow-400"
              }`}
            >
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
