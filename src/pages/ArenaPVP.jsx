import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";
import { connectWalletAndCheckNetwork } from "../utils/connectWallet";

const ArenaPVP = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [signature, setSignature] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [networkValid, setNetworkValid] = useState(true);

  const connectWallet = async () => {
    const wallet = await connectWalletAndCheckNetwork();
    if (!wallet) {
      setNetworkValid(false);
      return;
    }

    const { provider, signer, account } = wallet;
    const signed = await signer.signMessage("Login to Arena Duel");
    const gameContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

    setProvider(provider);
    setSigner(signer);
    setContract(gameContract);
    setWalletAddress(account);
    setSignature(signed);
    setNetworkValid(true);

    console.log("Wallet:", account);
    console.log("Signature:", signed);
  };

  const handleJoinMatch = async () => {
    if (!contract || !signer) return;

    setIsJoining(true);
    try {
      const userAddress = await signer.getAddress();
      const currentBattle = await contract.getBattle(userAddress);

      const alreadyInBattle =
        currentBattle &&
        (currentBattle.player1 !== ethers.ZeroAddress || currentBattle.player2 !== ethers.ZeroAddress) &&
        currentBattle.winner === ethers.ZeroAddress;

      if (alreadyInBattle) {
        alert("Kamu sudah berada dalam battle aktif.");
        navigate("/waiting");
        return;
      }

      const tx = await contract.joinBattle();
      await tx.wait();

      navigate("/waiting");
    } catch (error) {
      console.error("Gagal join match:", error);
      alert("Gagal join matchmaking. Pastikan cukup saldo dan wallet aktif.");
    }
    setIsJoining(false);
  };

  useEffect(() => {
    connectWallet();

    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => window.location.reload());
    }
  }, []);

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Arena PvP</h1>

      {walletAddress ? (
        <div className="mb-4">
          <p className={networkValid ? "text-green-400" : "text-yellow-400"}>
            Status: {networkValid ? "Terhubung" : "Jaringan Salah"}
          </p>
          <p className="text-sm break-all">{walletAddress}</p>
          <p className="text-xs break-all text-gray-400">
            Signature: {signature?.slice(0, 10)}...
          </p>
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
          isJoining || !networkValid
            ? "bg-gray-500"
            : "bg-purple-600 hover:bg-purple-700"
        } px-4 py-2 rounded`}
        disabled={isJoining || !walletAddress || !networkValid}
      >
        {isJoining ? "Gabung PvP..." : "Gabung PvP"}
      </button>
    </div>
  );
};

export default ArenaPVP;
