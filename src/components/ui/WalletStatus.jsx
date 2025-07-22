import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import contractABI from "../../utils/contractABI.json";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const storedWallet = localStorage.getItem("walletAddress");
    if (storedWallet) {
      connectWallet(); // Auto connect jika ada wallet disimpan
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask tidak ditemukan!");
      return;
    }

    const ethProvider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await ethProvider.send("eth_requestAccounts", []);
    const address = accounts[0];

    // Signature hanya saat login pertama kali
    const tempSigner = await ethProvider.getSigner();
    const message = "Sign in to Arena Duel Turn-Based";
    await tempSigner.signMessage(message);

    const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, contractABI, tempSigner);
    const sttBalance = await ethProvider.getBalance(address);
    const formatted = ethers.formatEther(sttBalance);

    setProvider(ethProvider);
    setSigner(tempSigner);
    setContract(contractInstance);
    setWallet(address);
    setBalance(formatted);
    localStorage.setItem("walletAddress", address);
  };

  const disconnectWallet = () => {
    setWallet(null);
    setBalance(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
    localStorage.removeItem("walletAddress");
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        balance,
        provider,
        signer,
        contract,
        connectWallet,
        disconnectWallet,
      }}
    >
      <div className="flex justify-end p-4 text-sm">
        {wallet ? (
          <div className="text-right">
            <div>Wallet: {wallet.slice(0, 6)}...{wallet.slice(-4)}</div>
            <div>Balance: {Number(balance).toFixed(4)} STT</div>
            <button
              className="mt-1 px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-white"
              onClick={disconnectWallet}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
          >
            Connect Wallet
          </button>
        )}
      </div>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
