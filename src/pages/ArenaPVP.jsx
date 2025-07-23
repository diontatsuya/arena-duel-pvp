import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";
import GameStatus from "../components/GameStatus"; // ✅ Tambahkan ini
import { useNavigate } from "react-router-dom";

const ArenaPVP = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isInGame, setIsInGame] = useState(false); // ✅ Tambahkan ini
  const navigate = useNavigate();

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setIsWalletConnected(true);
        setWalletAddress(accounts[0]);
        checkPlayerGameStatus(accounts[0]); // ✅ Cek status saat wallet terhubung
      }
    }
  };

  const checkPlayerGameStatus = async (address) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
      const player = await contract.players(address);
      if (player.opponent !== ethers.constants.AddressZero) {
        setIsInGame(true);
      } else {
        setIsInGame(false);
      }
    } catch (err) {
      console.error("Gagal memeriksa status game:", err);
    }
  };

  const handleJoinMatch = async () => {
    setErrorMessage("");

    if (!isWalletConnected) return;

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.matchPlayer();
      await tx.wait();
      navigate("/join-pvp");
    } catch (error) {
      console.error("Matchmaking gagal:", error);
      setErrorMessage("Gagal matchmaking: Kamu mungkin sudah berada dalam game.");
      checkPlayerGameStatus(walletAddress); // ✅ Perbarui status
    }
  };

  return (
    <div className="text-center mt-10">
      <h2 className="text-3xl font-bold mb-4">Bergabung ke Arena PvP</h2>
      <p className="mb-2">Alamat Wallet: {walletAddress}</p>
      {!isWalletConnected ? (
        <p className="text-red-500">Hubungkan wallet terlebih dahulu</p>
      ) : isInGame ? (
        <GameStatus address={walletAddress} /> // ✅ Tampilkan status game
      ) : (
        <button
          onClick={handleJoinMatch}
          className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Gabung PvP
        </button>
      )}
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
    </div>
  );
};

export default ArenaPVP;
