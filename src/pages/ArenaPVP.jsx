import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import HealthBar from "../components/ui/HealthBar";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState("Belum terhubung");
  const [playerData, setPlayerData] = useState(null);
  const [opponentData, setOpponentData] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const _provider = new ethers.BrowserProvider(window.ethereum);
      const _accounts = await _provider.send("eth_requestAccounts", []);
      const _signer = await _provider.getSigner();
      const _contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, _signer);

      setProvider(_provider);
      setSigner(_signer);
      setContract(_contract);
      setAccount(_accounts[0]);
      setStatus("Terhubung");
    } else {
      alert("MetaMask tidak ditemukan!");
    }
  };

  const joinMatch = async () => {
    if (!contract) return;
    try {
      const tx = await contract.joinMatch();
      await tx.wait();
      fetchGameData();
    } catch (err) {
      console.error("Gagal gabung match:", err);
    }
  };

  const fetchGameData = async () => {
    if (!contract || !account) return;
    try {
      const player = await contract.players(account);
      if (player.opponent !== ethers.ZeroAddress) {
        const opponent = await contract.players(player.opponent);
        setOpponentData(opponent);
      } else {
        setOpponentData(null);
      }
      setPlayerData(player);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (account && contract) {
      fetchGameData();
    }
  }, [account, contract]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Arena PvP</h1>
      <p className="mb-2">Status: {status}</p>

      {account && (
        <p className="mb-4">
          <span className="text-sm text-gray-400">Akun: </span>
          {account.slice(0, 6)}...{account.slice(-4)}
        </p>
      )}

      <button
        onClick={joinMatch}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition"
        disabled={status !== "Terhubung"}
      >
        Gabung PvP
      </button>

      {playerData && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Kamu</h2>
          <HealthBar hp={Number(playerData.hp)} />
          <p className="mt-1">Aksi Terakhir: {["-", "Attack", "Defend", "Heal"][playerData.lastAction]}</p>
        </div>
      )}

      {opponentData && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Lawan</h2>
          <HealthBar hp={Number(opponentData.hp)} />
          <p className="mt-1">Aksi Terakhir: {["-", "Attack", "Defend", "Heal"][opponentData.lastAction]}</p>
        </div>
      )}
    </div>
  );
};

export default ArenaPVP;
