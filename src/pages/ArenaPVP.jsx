import { useEffect, useState } from "react";
import { ethers } from "ethers";
import HealthBar from "../components/game/HealthBar";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ArenaPVP = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [status, setStatus] = useState("Belum terhubung");
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [action, setAction] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accs = await window.ethereum.request({ method: "eth_requestAccounts" });
        const address = accs[0];
        setWalletAddress(address);
        setStatus("Terhubung");

        const prov = new ethers.BrowserProvider(window.ethereum);
        const signer = await prov.getSigner();
        const instance = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

        setProvider(prov);
        setContract(instance);
      } catch (error) {
        console.error("Wallet connection error:", error);
        setStatus("Gagal terhubung");
      }
    } else {
      setStatus("Wallet tidak ditemukan");
    }
  };

  const joinMatch = async () => {
    if (!contract) return;
    try {
      const tx = await contract.joinMatch();
      setIsWaiting(true);
      await tx.wait();
      setIsWaiting(false);
    } catch (err) {
      console.error("Gabung match gagal:", err);
    }
  };

  const fetchPlayerData = async () => {
    if (!contract || !walletAddress) return;
    try {
      const p = await contract.players(walletAddress);
      setPlayer(p);

      if (p.opponent !== ethers.ZeroAddress) {
        const opp = await contract.players(p.opponent);
        setOpponent(opp);
      } else {
        setOpponent(null);
      }
    } catch (error) {
      console.error("Gagal ambil data player:", error);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (contract && walletAddress) {
      fetchPlayerData();
    }
  }, [contract, walletAddress]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Arena PvP</h1>
      <p className="mb-4">Status: {status}</p>

      <button
        onClick={joinMatch}
        disabled={isWaiting}
        className="bg-purple-700 px-4 py-2 rounded hover:bg-purple-600 mb-6"
      >
        Gabung PvP
      </button>

      <div className="grid grid-cols-2 gap-8">
        {/* Kamu */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Kamu</h2>
          <p>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
          {player && (
            <>
              <HealthBar hp={Number(player.hp)} />
              <p>Aksi: {["-", "Attack", "Defend", "Heal"][player.lastAction]}</p>
            </>
          )}
        </div>

        {/* Lawan */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Lawan</h2>
          {opponent ? (
            <>
              <p>{player.opponent.slice(0, 6)}...{player.opponent.slice(-4)}</p>
              <HealthBar hp={Number(opponent.hp)} />
              <p>Aksi: {["-", "Attack", "Defend", "Heal"][opponent.lastAction]}</p>
            </>
          ) : (
            <p>Belum ada lawan</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArenaPVP;
