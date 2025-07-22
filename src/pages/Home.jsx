import { useEffect, useState } from "react";
import { ethers } from "ethers";
import WalletStatus from "../components/ui/WalletStatus";

const Home = () => {
  const [wallet, setWallet] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWallet(accounts[0]);
      } catch (error) {
        console.error("Gagal connect wallet:", error);
      }
    } else {
      alert("Metamask tidak ditemukan!");
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
  };

  useEffect(() => {
    const checkConnectedWallet = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWallet(accounts[0]);
        }
      }
    };
    checkConnectedWallet();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Arena Duel Turn-Based</h1>

      {!wallet ? (
        <button
          onClick={connectWallet}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Connect Wallet
        </button>
      ) : (
        <WalletStatus walletAddress={wallet} onDisconnect={disconnectWallet} />
      )}

      <div className="mt-8">
        <p>Selamat datang di game Arena Duel Turn-Based!</p>
        <p>
          Silakan hubungkan wallet kamu dan pilih mode permainan melalui menu
          navigasi.
        </p>
      </div>
    </div>
  );
};

export default Home;
