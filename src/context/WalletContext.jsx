import { createContext, useContext, useState, useEffect } from "react";
import { connectWallet, disconnectWallet } from "../utils/WalletConnect";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(false);

  const connect = async () => {
    setLoading(true);
    const result = await connectWallet();
    if (result) {
      setWalletAddress(result.account);
      setSigner(result.signer);
      setProvider(result.provider);
    }
    setLoading(false);
  };

  const disconnect = () => {
    disconnectWallet();
    setWalletAddress(null);
    setSigner(null);
    setProvider(null);
  };

  // Opsional: auto-connect jika sebelumnya sudah terhubung
  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      connect(); // Auto-reconnect jika user belum disconnect dari MetaMask
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        signer,
        provider,
        connect,
        disconnect,
        loading,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
export { WalletContext };
