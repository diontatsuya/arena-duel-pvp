import { createContext, useContext, useState, useEffect } from "react";
import {
  connectWallet as connectWithProvider,
  disconnectWallet as disconnectFromProvider,
  getNativeBalance,
} from "../utils/connectWallet";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signature, setSignature] = useState(null);
  const [sttBalance, setSttBalance] = useState("0");
  const [loading, setLoading] = useState(false);
  const [player, setPlayer] = useState(null); // ← Tambahan: real user info

  const fetchSttBalance = async (address) => {
    try {
      const balance = await getNativeBalance(address);
      setSttBalance(balance);
    } catch (error) {
      console.error("Gagal mengambil saldo STT:", error);
      setSttBalance("0");
    }
  };

  const fetchPlayerData = async (signer) => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const address = await signer.getAddress();
      const playerData = await contract.players(address);
      setPlayer(playerData);
    } catch (err) {
      console.error("Gagal fetch data pemain:", err);
      setPlayer(null);
    }
  };

  const connectWallet = async () => {
    setLoading(true);
    try {
      const result = await connectWithProvider();
      if (result) {
        setWalletAddress(result.account);
        setSigner(result.signer);
        setProvider(result.provider);
        setSignature(result.signature);
        await fetchSttBalance(result.account);
        await fetchPlayerData(result.signer); // ← Tambahan: real user fetch
      }
    } catch (err) {
      console.error("Gagal konek wallet:", err);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    disconnectFromProvider();
    setWalletAddress(null);
    setSigner(null);
    setProvider(null);
    setSignature(null);
    setSttBalance("0");
    setPlayer(null); // ← Tambahan: reset player
  };

  useEffect(() => {
    const ethereum = window.ethereum || window.mises || window.okxwallet;
    if (ethereum && ethereum.selectedAddress) {
      connectWallet();
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        signer,
        provider,
        signature,
        sttBalance,
        loading,
        player, // ← Tambahan: expose real user info
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
export { WalletContext };
