// src/pages/ArenaPVP.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [status, setStatus] = useState("Belum terhubung");

  // Koneksi awal ke wallet dan kontrak
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const prov = new ethers.BrowserProvider(window.ethereum);
        const signer = await prov.getSigner();
        const address = await signer.getAddress();
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
        setProvider(prov);
        setSigner(signer);
        setWalletAddress(address);
        setContract(contractInstance);
        setStatus("Terhubung");
      }
    };
    init();
  }, []);

  // Ambil status player dan lawan
  const fetchStatus = async () => {
    if (contract && walletAddress) {
      const playerData = await contract.players(walletAddress);
      setPlayer(playerData);

      if (playerData.opponent !== ethers.ZeroAddress) {
        const opponentData = await contract.players(playerData.opponent);
        setOpponent(opponentData);
      } else {
        setOpponent(null);
      }
    }
  };

  // Panggil setiap kali wallet/kontrak berubah
  useEffect(() => {
    fetchStatus();
  }, [contract, walletAddress]);

  // Gabung ke PvP
  const joinPvP = async () => {
    if (contract && walletAddress) {
      try {
        const tx = await contract.matchPlayer();
        await tx.wait();
        fetchStatus();
      } catch (error) {
        console.error("Gagal bergabung PvP:", error);
      }
    }
  };

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl font-bold mb-4">Arena PvP</h2>
      <p className="mb-4">Status: {status}</p>

      {!player || player.opponent === ethers.ZeroAddress ? (
        <button
          onClick={joinPvP}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded mb-6"
        >
          Gabung PvP
        </button>
      ) : (
        <p className="text-yellow-300 mb-6">Kamu telah bergabung.</p>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Kamu</h3>
          {player ? (
            <>
              <p>HP: {player.hp.toString()}</p>
              <p>Terakhir Aksi: {player.lastAction}</p>
              <p>Giliranku: {player.isTurn ? "Ya" : "Tidak"}</p>
            </>
          ) : (
            <p>Belum bergabung</p>
          )}
        </div>

        <div className="bg-gray-800 p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Lawan</h3>
          {opponent ? (
            <>
              <p>HP: {opponent.hp.toString()}</p>
              <p>Terakhir Aksi: {opponent.lastAction}</p>
              <p>Gilirannya: {opponent.isTurn ? "Ya" : "Tidak"}</p>
            </>
          ) : (
            <p>-</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArenaPVP;
