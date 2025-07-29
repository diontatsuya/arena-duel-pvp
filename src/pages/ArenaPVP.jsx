import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";
import { useNavigate } from "react-router-dom";

const ArenaPVP = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isJoining, setIsJoining] = useState(false);

  const navigate = useNavigate();

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask tidak ditemukan");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const { chainId } = await provider.getNetwork();

      const SOMNIA_CHAIN_ID = 50312; // Sesuaikan jika Somnia punya chainId lain
      if (chainId !== 50312) {
        alert("Harap sambungkan ke jaringan Somnia Testnet.");
        return;
      }

      setWalletAddress(accounts[0]);
      setProvider(provider);
      setSigner(signer);

      const gameContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      setContract(gameContract);
    } catch (err) {
      console.error("Gagal menghubungkan wallet:", err);
    }
  };

  const handleJoinMatch = async () => {
    if (!contract || !signer) return;

    setIsJoining(true);
    try {
      const tx = await contract.joinBattle();
      await tx.wait();
      navigate("/waiting");
    } catch (error) {
      console.error("Gagal join match:", error);
    }
    setIsJoining(false);
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div className="text-center py-10">
      <h1 className="text-3xl font-bold mb-6">Arena PvP</h1>
      {walletAddress ? (
        <>
          <p className="mb-4">Terhubung: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
          <button
            className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700"
            onClick={handleJoinMatch}
            disabled={isJoining}
          >
            {isJoining ? "Bergabung..." : "Gabung PvP"}
          </button>
        </>
      ) : (
        <button
          className="bg-green-600 px-6 py-2 rounded hover:bg-green-700"
          onClick={connectWallet}
        >
          Hubungkan Wallet
        </button>
      )}
    </div>
  );
};

export default ArenaPVP;
