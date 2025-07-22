import { useEffect, useState } from "react";
import { ethers } from "ethers";
import WalletStatus from "../components/ui/WalletStatus";

const Home = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      await ethProvider.send("eth_requestAccounts", []);
      const signer = await ethProvider.getSigner();
      setProvider(ethProvider);
      setSigner(signer);
    } else {
      alert("MetaMask tidak ditemukan!");
    }
  };

  useEffect(() => {
    const autoConnect = async () => {
      if (window.ethereum) {
        const ethProvider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await ethProvider.send("eth_accounts", []);
        if (accounts.length > 0) {
          const signer = await ethProvider.getSigner();
          setProvider(ethProvider);
          setSigner(signer);
        }
      }
    };
    autoConnect();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Arena Duel!</h1>
      <p className="text-lg mb-8">Connect your wallet to start the battle.</p>

      {!signer ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-xl font-semibold text-red-500">Wallet belum terkoneksi</p>
          <button
            onClick={connectWallet}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-xl"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <WalletStatus signer={signer} provider={provider} />
      )}
    </div>
  );
};

export default Home;
