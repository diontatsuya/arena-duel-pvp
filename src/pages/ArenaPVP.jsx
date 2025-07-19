// src/pages/ArenaPVP.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import HealthBar from "../components/HealthBar";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState("Not connected");
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      const _provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await _provider.send("eth_requestAccounts", []);
      const _signer = _provider.getSigner();
      const _contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, _signer);

      setProvider(_provider);
      setSigner(_signer);
      setContract(_contract);
      setAccount(accounts[0]);
      setStatus("Connected");

      // Signature (optional for Somnia)
      const signature = await _signer.signMessage("ArenaDuel Authentication");
      console.log("Signature:", signature);
    }
  };

  const fetchGameState = async () => {
    if (!contract || !account) return;

    const p = await contract.players(account);
    const o = await contract.players(p.opponent);

    setPlayer(p);
    setOpponent(o);
    setIsMyTurn(p.isTurn);
  };

  const handleAction = async (action) => {
    if (!contract || !isMyTurn) return;
    setLoading(true);
    const tx = await contract.takeAction(action);
    await tx.wait();
    setLoading(false);
    fetchGameState();
  };

  useEffect(() => {
    if (contract && account) {
      fetchGameState();
    }
  }, [contract, account]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans">
      <nav className="flex justify-between items-center p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">Arena Duel PvP</h1>
        {account ? (
          <span className="text-green-400">Connected: {account.slice(0, 6)}...{account.slice(-4)}</span>
        ) : (
          <button onClick={connectWallet} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition">
            Connect Wallet
          </button>
        )}
      </nav>

      <main className="p-6 flex flex-col items-center">
        {player && opponent ? (
          <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-center text-lg mb-4">Battle Status</h2>

            <div className="flex justify-between mb-6">
              <div>
                <h3 className="mb-1">You</h3>
                <HealthBar hp={player.hp.toNumber()} />
              </div>
              <div>
                <h3 className="mb-1">Opponent</h3>
                <HealthBar hp={opponent.hp.toNumber()} />
              </div>
            </div>

            <div className="text-center">
              {loading ? (
                <p>Processing action...</p>
              ) : isMyTurn ? (
                <div className="flex justify-center space-x-4">
                  <button onClick={() => handleAction(1)} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">Attack</button>
                  <button onClick={() => handleAction(2)} className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600">Defend</button>
                  <button onClick={() => handleAction(3)} className="bg-green-500 px-4 py-2 rounded hover:bg-green-600">Heal</button>
                </div>
              ) : (
                <p className="text-gray-400">Waiting for opponent's turn...</p>
              )}
            </div>
          </div>
        ) : (
          <p className="mt-10">Connecting or waiting for matchmaking...</p>
        )}
      </main>
    </div>
  );
};

export default ArenaPVP;
