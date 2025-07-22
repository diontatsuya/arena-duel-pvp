import { useEffect, useState } from "react";
import { ethers } from "ethers";
import WalletStatus from "../components/ui/WalletStatus";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";

const Home = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [sttBalance, setSttBalance] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load STT balance
  const fetchSTTBalance = async (account, signerOrProvider) => {
    try {
      const sttContract = new ethers.Contract(CONTRACT_ADDRESS.STT, contractABI.STT, signerOrProvider);
      const balance = await sttContract.balanceOf(account);
      setSttBalance(ethers.utils.formatUnits(balance, 18));
    } catch (error) {
      console.error("Failed to fetch STT balance:", error);
    }
  };

  // Connect wallet + sign message for login
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("MetaMask not detected");

      const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await tempProvider.send("eth_requestAccounts", []);
      const tempSigner = tempProvider.getSigner();
      const userAddress = await tempSigner.getAddress();

      // Signature login
      const message = "Login to Arena Duel";
      const signature = await tempSigner.signMessage(message);
      console.log("Signature:", signature);

      setProvider(tempProvider);
      setSigner(tempSigner);
      setAccount(userAddress);
      setIsLoggedIn(true);

      const gameContract = new ethers.Contract(CONTRACT_ADDRESS.GAME, contractABI.GAME, tempSigner);
      setContract(gameContract);

      await fetchSTTBalance(userAddress, tempProvider);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  // Logout wallet (clear state only)
  const logoutWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setContract(null);
    setSttBalance(null);
    setIsLoggedIn(false);
  };

  // Reconnect if wallet already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await tempProvider.listAccounts();
        if (accounts.length > 0) {
          setProvider(tempProvider);
          const tempSigner = tempProvider.getSigner();
          setSigner(tempSigner);
          const userAddress = await tempSigner.getAddress();
          setAccount(userAddress);

          const gameContract = new ethers.Contract(CONTRACT_ADDRESS.GAME, contractABI.GAME, tempSigner);
          setContract(gameContract);

          await fetchSTTBalance(userAddress, tempProvider);
        }
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Arena Duel Turn-Based</h1>
      <div className="max-w-md mx-auto">
        <WalletStatus
          isLoggedIn={isLoggedIn}
          account={account}
          sttBalance={sttBalance}
          onConnect={connectWallet}
          onLogout={logoutWallet}
        />
      </div>
    </div>
  );
};

export default Home;
