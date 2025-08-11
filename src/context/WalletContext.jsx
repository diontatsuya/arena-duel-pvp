import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fungsi connect wallet
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Wallet tidak ditemukan. Gunakan MetaMask atau browser DApp.");
        return;
      }

      const prov = new ethers.providers.Web3Provider(ethereum);
      await ethereum.request({ method: "eth_requestAccounts" });

      const sign = prov.getSigner();
      const address = await sign.getAddress();

      setProvider(prov);
      setSigner(sign);
      setWalletAddress(address);
    } catch (error) {
      console.error("Gagal connect wallet:", error);
      alert("Gagal menghubungkan wallet.");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi disconnect wallet
  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setWalletAddress(null);
  };

  useEffect(() => {
    connectWallet();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        connectWallet();
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        provider,
        signer,
        walletAddress,
        loading,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
