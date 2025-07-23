// src/pages/ArenaPVP.jsx
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [status, setStatus] = useState("Belum terhubung");
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fungsi utama connect + contract setup
  const connectWallet = async () => {
    if (window.ethereum) {
      const p = new ethers.BrowserProvider(window.ethereum);
      await p.send("eth_requestAccounts", []);
      const s = await p.getSigner();
      const address = await s.getAddress();
      const c = new ethers.Contract(CONTRACT_ADDRESS, contractABI, s);
      setProvider(p);
      setSigner(s);
      setWalletAddress(address);
      setContract(c);
      setStatus("Terhubung");
    }
  };

  const joinMatch = async () => {
    if (!contract || !walletAddress) return;
    setLoading(true);
    try {
      const tx = await contract.matchPlayer();
      await tx.wait();
      setStatus("Menunggu lawan...");
      fetchStatus(); // perbarui data setelah join
    } catch (err) {
      console.error("Gagal join:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatus = async () => {
    if (!contract || !walletAddress) return;

    try {
      const p = await contract.players(walletAddress);
      const o = p.opponent && p.opponent !== ethers.ZeroAddress
        ? await contract.players(p.opponent)
        : null;

      setPlayer(p);
      setOpponent(o);
      setIsPlayerTurn(p.isTurn);

      // Cek menang/kalah
      if (p.hp === 0 && o?.hp > 0) setWinner("Lawan menang");
      else if (o?.hp === 0 && p.hp > 0) setWinner("Kamu menang");
      else if (p.hp === 0 && o?.hp === 0) setWinner("Seri");
      else setWinner(null);
    } catch (err) {
      console.error("Gagal fetch status:", err);
    }
  };

  const handleAction = async (actionIndex) => {
    if (!contract || !walletAddress || !isPlayerTurn) return;
    setLoading(true);
    try {
      const tx = await contract.takeTurn(actionIndex);
      await tx.wait();
      fetchStatus(); // update status setelah aksi
    } catch (err) {
      console.error("Gagal aksi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (contract && walletAddress) {
      fetchStatus();
      const interval = setInterval(fetchStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [contract, walletAddress]);

  return (
    <div className="p-4 max-w-xl mx-auto text-center bg-gray-800 rounded-xl mt-6 shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Arena PvP</h1>
      <p className="mb-2">Status: {status}</p>
      {!player?.opponent && (
        <button
          onClick={joinMatch}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
          disabled={loading}
        >
          {loading ? "Memproses..." : "Gabung PvP"}
        </button>
      )}

      {player?.opponent && (
        <>
          <div className="my-4 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-700 p-3 rounded">
              <h2 className="font-semibold mb-1">Kamu</h2>
              <p>HP: {player.hp}</p>
              <p>Aksi terakhir: {["-", "Attack", "Defend", "Heal"][player.lastAction]}</p>
              <p>{isPlayerTurn ? "🎯 Giliranmu" : ""}</p>
            </div>
            <div className="bg-gray-700 p-3 rounded">
              <h2 className="font-semibold mb-1">Lawan</h2>
              {opponent ? (
                <>
                  <p>HP: {opponent.hp}</p>
                  <p>Aksi terakhir: {["-", "Attack", "Defend", "Heal"][opponent.lastAction]}</p>
                  <p>{!isPlayerTurn ? "🔄 Giliran lawan" : ""}</p>
                </>
              ) : (
                <p>Menunggu lawan bergabung...</p>
              )}
            </div>
          </div>

          {winner ? (
            <p className="text-lg font-bold text-green-400">{winner}</p>
          ) : (
            isPlayerTurn && (
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => handleAction(1)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                  disabled={loading}
                >
                  Attack
                </button>
                <button
                  onClick={() => handleAction(2)}
                  className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded"
                  disabled={loading}
                >
                  Defend
                </button>
                <button
                  onClick={() => handleAction(3)}
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                  disabled={loading}
                >
                  Heal
                </button>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default ArenaPVP;
