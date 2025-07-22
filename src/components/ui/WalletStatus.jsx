import { useEffect, useState } from "react";
import { ethers } from "ethers";
import WalletStatus from "../components/ui/WalletStatus";

const Home = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const ethProvider = new ethers.BrowserProvider(window.ethereum);
        await ethProvider.send("eth_requestAccounts", []);
        const signer = await ethProvider.getSigner();
        setProvider(ethProvider);
        setSigner(signer);
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      alert("MetaMask not detected");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Welcome to Arena Duel!</h1>
      {!signer ? (
        <button
          onClick={connectWallet}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white font-semibold transition"
        >
          Connect Wallet
        </button>
      ) : (
        <WalletStatus signer={signer} provider={provider} />
      )}
    </div>
  );
};

export default Home;
