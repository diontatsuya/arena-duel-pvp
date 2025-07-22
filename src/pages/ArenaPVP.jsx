// src/pages/ArenaPVP.jsx

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [status, setStatus] = useState("Belum terhubung");

  const connectWallet = async () => {
    if (window.ethereum) {
      const _provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const _signer = await _provider.getSigner();
      const _account = await _signer.getAddress();
      const _contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, _signer);

      setProvider(_provider);
      setSigner(_signer);
      setAccount(_account);
      setContract(_contract);
      setStatus("Terhubung");
    } else {
      alert("Silakan instal MetaMask terlebih dahulu!");
    }
  };

  const joinMatchmaking = async () => {
    if (!contract) return;
    try {
      const tx = await contract.matchPlayer();
      await tx.wait();
      fetchStatus();
    } catch (error) {
      console.error("Gagal bergabung matchmaking:", error);
    }
  };

  const fetchStatus = async () => {
    if (!contract || !account) return;
    try {
      const playerData = await contract.players(account);
      if (playerData.opponent !== ethers.ZeroAddress) {
        const opponentData = await contract.players(playerData.opponent);
        setPlayer(playerData);
        setOpponent(opponentData);
      } else {
        setPlayer(playerData);
        setOpponent(null);
      }
    } catch (error) {
      console.error("Gagal mengambil status:", error);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (contract && account) {
      fetchStatus();

      const interval = setInterval(() => {
        fetchStatus();
      }, 5000); // update tiap 5 detik

      return () => clearInterval(interval);
    }
  }, [contract, account]);

  const shorten = (addr) => addr?.slice(0, 6) + "..." + addr?.slice(-4);

  return (
    <div className="p-4 max-w-3xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-4">Arena PvP</h1>
      <p className="mb-2">Status: {status}</p>
      {account && <p className="mb-4">Akun: {shorten(account)}</p>}
      <button
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mb-6"
        onClick={joinMatchmaking}
      >
        Gabung PvP
      </button>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Kamu</h2>
          <p>{shorten(account)}</p>
          <p>{player ? `${player.hp} / 100` : "-"}</p>
          <p>Aksi Terakhir: {player?.lastAction || "-"}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Lawan</h2>
          <p>{opponent ? shorten(player.opponent) : "?"}</p>
          <p>{opponent ? `${opponent.hp} / 100` : "-"}</p>
          <p>Aksi Terakhir: {opponent?.lastAction || "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default ArenaPVP;
