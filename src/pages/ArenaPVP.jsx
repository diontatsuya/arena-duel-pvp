// src/pages/ArenaPVP.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import HealthBar from "../components/game/HealthBar";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);

  // Hubungkan wallet dan siapkan kontrak
  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      setProvider(provider);
      setSigner(signer);
      setAccount(address);
      setContract(contract);
    }
  };

  const fetchStatus = async () => {
    if (contract && account) {
      const playerData = await contract.players(account);
      const opponentData = playerData.opponent !== ethers.ZeroAddress
        ? await contract.players(playerData.opponent)
        : null;

      setPlayer(playerData);
      setOpponent(opponentData);
    }
  };

  const joinMatch = async () => {
    if (contract) {
      try {
        const tx = await contract.joinMatch();
        await tx.wait();
        await fetchStatus();
      } catch (err) {
        console.error("Gagal gabung match:", err);
      }
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (contract && account) {
      fetchStatus();
    }
  }, [contract, account]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Arena PvP</h1>
      <p>Status: {account ? "Terhubung" : "Belum terhubung"}</p>
      <p className="mb-4">Akun: {account || "-"}</p>
      <button
        onClick={joinMatch}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-4"
      >
        Gabung PvP
      </button>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Kamu</h2>
          <p>{account}</p>
          {player && (
            <>
              <HealthBar hp={Number(player.hp)} />
              <p>Aksi Terakhir: {["-", "Attack", "Defend", "Heal"][player.lastAction]}</p>
            </>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Lawan</h2>
          <p>{player?.opponent === ethers.ZeroAddress ? "?" : player?.opponent}</p>
          {opponent && (
            <>
              <HealthBar hp={Number(opponent.hp)} />
              <p>Aksi Terakhir: {["-", "Attack", "Defend", "Heal"][opponent.lastAction]}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArenaPVP;
