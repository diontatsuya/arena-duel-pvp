// src/pages/ArenaPVP.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";

const ArenaPVP = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [status, setStatus] = useState("Belum terhubung");
  const [isJoining, setIsJoining] = useState(false);

  // Connect wallet & initialize contract
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const _provider = new ethers.providers.Web3Provider(window.ethereum);
        await _provider.send("eth_requestAccounts", []);
        const _signer = _provider.getSigner();
        const address = await _signer.getAddress();

        const _contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, _signer);

        setProvider(_provider);
        setSigner(_signer);
        setWalletAddress(address);
        setContract(_contract);
        setStatus("Terhubung");
      } catch (err) {
        console.error("Gagal terhubung wallet:", err);
        setStatus("Gagal terhubung");
      }
    } else {
      alert("Silakan install MetaMask terlebih dahulu.");
    }
  };

  const handleJoinMatch = async () => {
    if (!contract || !walletAddress) return;
    try {
      setIsJoining(true);
      const tx = await contract.joinMatch();
      await tx.wait();
      console.log("Transaksi berhasil:", tx.hash);
      fetchStatus();
    } catch (err) {
      console.error("Gagal gabung PvP:", err);
    } finally {
      setIsJoining(false);
    }
  };

  const fetchStatus = async () => {
    if (!contract || !walletAddress) return;

    try {
      const data = await contract.players(walletAddress);
      const opponentData = data.opponent !== ethers.constants.AddressZero
        ? await contract.players(data.opponent)
        : null;

      setPlayer(data);
      setOpponent(opponentData);
    } catch (err) {
      console.error("Gagal fetch status:", err);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Arena PvP</h2>
      <p>Status: <span className="font-semibold">{status}</span></p>
      {walletAddress && <p>Akun: <span className="text-sm">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span></p>}

      <button
        className={`mt-4 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50`}
        onClick={handleJoinMatch}
        disabled={isJoining}
      >
        {isJoining ? "Menggabungkan..." : "Gabung PvP"}
      </button>

      <div className="mt-6 bg-gray-700 p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Kamu</h3>
        <p>{walletAddress ? walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4) : "?"}</p>
        <p>{player ? `${player.hp} / 100` : "0 / 100"}</p>
        <p>Aksi Terakhir: {player && player.lastAction !== 0 ? ActionLabel[player.lastAction] : "-"}</p>
      </div>

      <div className="mt-4 bg-gray-700 p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Lawan</h3>
        <p>{opponent ? opponent.opponent.slice(0, 6) + "..." + opponent.opponent.slice(-4) : "?"}</p>
        <p>{opponent ? `${opponent.hp} / 100` : "0 / 100"}</p>
        <p>Aksi Terakhir: {opponent && opponent.lastAction !== 0 ? ActionLabel[opponent.lastAction] : "-"}</p>
      </div>
    </div>
  );
};

const ActionLabel = {
  1: "Attack",
  2: "Defend",
  3: "Heal",
};

export default ArenaPVP;
