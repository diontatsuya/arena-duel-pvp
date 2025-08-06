import { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  connectWallet as connectWithProvider,
  disconnectWallet as disconnectFromProvider,
} from "../utils/connectWallet";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signature, setSignature] = useState(null);
  const [sttBalance, setSttBalance] = useState("0");
  const [loading, setLoading] = useState(false);

  const STT_TOKEN_ADDRESS = "0x841b9fcB0c9E19Ba7eE387E9F011fe79D860d73A"; // ganti jika perlu
  const STT_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)"
  ];

  const fetchSttBalance = async (address, providerInstance) => {
    try {
      const contract = new ethers.Contract(STT_TOKEN_ADDRESS, STT_ABI, providerInstance);
      const rawBalance = await contract.balanceOf(address);
      const decimals = await contract.decimals();
      const formatted = ethers.utils.formatUnits(rawBalance, decimals);
      setSttBalance(formatted);
    } catch (error) {
      console.error("Gagal mengambil saldo STT:", error);
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
        await fetchSttBalance(result.account, result.provider);
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
        sttBalance, // <- tambahkan ke context
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
