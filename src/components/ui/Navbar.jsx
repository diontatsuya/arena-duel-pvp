import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import { contractABI } from "../../utils/contractABI";

const Navbar = () => {
  const [address, setAddress] = useState(null);
  const [status, setStatus] = useState("Belum terhubung");
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [lastAction, setLastAction] = useState(null);
  const [opponentAction, setOpponentAction] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask tidak ditemukan!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      // Signature untuk Somnia
      const message = "Sign in to Arena Duel on Somnia";
      await signer.signMessage(message);

      setAddress(userAddress);
      setStatus("Terhubung");

      // Load data PvP
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
      const playerData = await contract.players(userAddress);
      setPlayer(playerData);

      if (playerData.opponent !== ethers.ZeroAddress) {
        const opponentData = await contract.players(playerData.opponent);
        setOpponent(opponentData);
        setOpponentAction(opponentData.lastAction);
      }

      setLastAction(playerData.lastAction);
    } catch (err) {
      console.error("Gagal konek wallet:", err);
    }
  };

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      connectWallet(); // auto-reconnect
    }
  }, []);

  const shortenAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const renderAction = (action) => {
    if (!action) return "-";
    const act = parseInt(action);
    if (act === 1) return "Attack";
    if (act === 2) return "Defend";
    if (act === 3) return "Heal";
    return "-";
  };

  return (
    <div className="w-full bg-gray-800 px-4 py-3 flex flex-col sm:flex-row items-center justify-between text-white">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl font-bold text-yellow-400">
          Arena Duel
        </Link>
        <Link to="/pvp" className="hover:text-yellow-300">Arena PvP</Link>
        <Link to="/pve" className="hover:text-yellow-300">Arena PvE</Link>
      </div>

      <div className="mt-3 sm:mt-0 flex flex-col items-end">
        {address ? (
          <>
            <p className="text-sm text-green-400">{shortenAddress(address)}</p>
            <p className="text-xs text-gray-300">Status: {status}</p>
            {player && (
              <div className="mt-2 text-sm text-white">
                <div><strong>Kamu:</strong> {shortenAddress(address)}</div>
                <div>Aksi: {renderAction(lastAction)}</div>
                <div className="mt-1"><strong>Lawan:</strong> {player.opponent !== ethers.ZeroAddress ? shortenAddress(player.opponent) : "-"}</div>
                <div>Aksi: {renderAction(opponentAction)}</div>
              </div>
            )}
          </>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded"
          >
            Hubungkan Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
