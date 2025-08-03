import { createContext, useContext, useState, useEffect } from "react";
import { connectWallet } from "../utils/connectWallet";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadWallet = async () => {
    const result = await connectWallet();
    if (result) {
      setWalletAddress(result.account);
      setSigner(result.signer);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadWallet();
  }, []);

  return (
    <WalletContext.Provider
      value={{ walletAddress, signer, loading, reloadWallet: loadWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
