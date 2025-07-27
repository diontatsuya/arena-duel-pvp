// src/pages/ArenaPVP.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";
import ActionButtons from "../components/ui/ActionButtons";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [opponentData, setOpponentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Belum terhubung");

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const tempProvider = new ethers.BrowserProvider(window.ethereum);
        const tempSigner = await tempProvider.getSigner();
        const tempContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, tempSigner);

        setProvider(tempProvider);
        setSigner(tempSigner);
        setContract(tempContract);
        setStatus("Terhubung");
      } else {
        setStatus("Wallet tidak ditemukan");
      }
    };
    init();
  }, []);

  const getPlayerData = async (address) => {
    const data = await contract.players(address);
    return {
      opponent: data.opponent,
      hp: parseInt(data.hp),
      isTurn: data.isTurn,
      lastAction: Number(data.lastAction),
    };
  };

  const fetchGameState = async () => {
    const address = await signer.getAddress();
    const data = await getPlayerData(address);

    let opponent = null;
    if (data.opponent && data.opponent !== ethers.ZeroAddress) {
      opponent = await getPlayerData(data.opponent);
    }

    setPlayerData(data);
    setOpponentData(opponent);
    setLoading(false);
  };

  const joinMatch = async () => {
    setStatus("Menunggu lawan...");
    const tx = await contract.joinGame();
    await tx.wait();
    setStatus("Bertarung!");
    fetchGameState();
  };

  const handleAction = async (action) => {
    const tx = await contract.performAction(action); // 1: attack, 2: defend, 3: heal
    await tx.wait();
    fetchGameState();
  };

  useEffect(() => {
    if (contract && signer) {
      fetchGameState();
    }
  }, [contract, signer]);

  // Poll update jika bukan giliran kita
  useEffect(() => {
    if (playerData && !playerData.isTurn) {
      const interval = setInterval(() => {
        fetchGameState();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [playerData]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-xl shadow-lg mt-6">
      <h1 className="text-3xl font-bold text-center mb-4 text-yellow-400">Arena PvP</h1>
      <p className="text-center text-gray-300 mb-6">Status: {status}</p>
      <div className="flex justify-center mb-4">
        <button
          onClick={joinMatch}
          className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition"
        >
          Gabung PvP
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-300">Memuat data...</p>
      ) : (
        <>
          {!opponentData ? (
            <p className="text-center text-yellow-300">Menunggu lawan bergabung...</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h2 className="text-xl font-bold text-white mb-2">Kamu</h2>
                <p>HP: {playerData.hp}</p>
                <p>Last Action: {["None", "Attack", "Defend", "Heal"][playerData.lastAction] ?? "Unknown"}</p>
                <p className="text-green-400">{playerData.isTurn ? "Giliranmu!" : "Menunggu lawan..."}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h2 className="text-xl font-bold text-white mb-2">Lawan</h2>
                <p>HP: {opponentData.hp}</p>
                <p>Last Action: {["None", "Attack", "Defend", "Heal"][opponentData.lastAction] ?? "Unknown"}</p>
              </div>
            </div>
          )}

          {playerData?.isTurn && opponentData && (
            <ActionButtons onAction={handleAction} />
          )}
        </>
      )}
    </div>
  );
};

export default ArenaPVP;
