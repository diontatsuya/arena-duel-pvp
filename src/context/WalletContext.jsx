import { createContext, useContext, useState, useEffect } from "react";
import {
  connectWallet as connectWithProvider,
  disconnectWallet as disconnectFromProvider,
  getNativeBalance,
} from "../utils/connectWallet";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signature, setSignature] = useState(null);
  const [sttBalance, setSttBalance] = useState("0");
  const [loading, setLoading] = useState(false);

  const fetchSttBalance = async (address) => {
    try {
      const balance = await getNativeBalance(address);
      setSttBalance(balance);
    } catch (error) {
      console.error("Gagal mengambil saldo STT:", error);
      setSttBalance("0");
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
