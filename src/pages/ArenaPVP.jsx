import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";

const ArenaPVP = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isJoining, setIsJoining] = useState(false);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask tidak ditemukan. Silakan instal terlebih dahulu.");
        return;
      }

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const network = await window.ethereum.request({ method: "eth_chainId" });

      if (network !== "0xc470") {
        alert("Harap ganti ke jaringan Somnia Testnet");
        return;
      }

      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      setProvider(ethersProvider);
      setSigner(signer);
      setContract(contract);
      setWalletAddress(address);
    } catch (error) {
      console.error("Gagal menghubungkan wallet:", error);
    }
  };

  const handleJoinMatch = async () => {
    if (!contract || !signer) return;

    setIsJoining(true);
    try {
      const tx = await contract.joinBattle();
      await tx.wait();

      const userAddress = await signer.getAddress();
      const battle = await contract.getBattle(userAddress);

      const isInBattle =
        battle &&
        (battle.player1 !== ethers.ZeroAddress || battle.player2 !== ethers.ZeroAddress);

      if (isInBattle) {
        navigate("/waiting");
      } else {
        alert("Gagal menemukan battle aktif. Coba lagi.");
      }
    } catch (error) {
      console.error("Gagal join match:", error);
      alert("Gagal join matchmaking. Pastikan cukup saldo dan wallet aktif.");
    }
    setIsJoining(false);
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Arena PvP</h1>
      {walletAddress ? (
        <div className="mb-4">
          <p className="text-green-400">Status: Terhubung</p>
          <p className="text-sm break-all">{walletAddress}</p>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 mb-4"
        >
          Hubungkan Wallet
        </button>
      )}

      <button
        onClick={handleJoinMatch}
        className={`${
          isJoining ? "bg-gray-500" : "bg-purple-600 hover:bg-purple-700"
        } px-4 py-2 rounded`}
        disabled={isJoining || !walletAddress}
      >
        {isJoining ? "Gabung PvP..." : "Gabung PvP"}
      </button>
    </div>
  );
};

export default ArenaPVP;
