import { createContext, useContext, useState, useEffect } from "react";
import {
  connectWallet as connectWithProvider,
  disconnectWallet as disconnectFromProvider,
} from "../utils/connectWallet";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    setLoading(true);
    try {
      const result = await connectWithProvider();
      if (result) {
        setWalletAddress(result.account);
        setSigner(result.signer);
        setProvider(result.provider);
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
