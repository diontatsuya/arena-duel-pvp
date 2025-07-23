// src/pages/ArenaPVP.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [opponentData, setOpponentData] = useState(null);
  const [status, setStatus] = useState("Belum terhubung");

  // 1. Connect wallet + set signer & contract
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const newSigner = await newProvider.getSigner();
        const address = await newSigner.getAddress();
        const newContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, newSigner);

        setProvider(newProvider);
        setSigner(newSigner);
        setAccount(address);
        setContract(newContract);
        setStatus("Terhubung");
      }
    };
    init();
  }, []);

  // 2. Ambil data pemain dari contract
  const fetchPlayerData = async () => {
    if (!contract || !account) return;

    try {
      const data = await contract.players(account);
      setPlayerData(data);

      if (data.opponent !== ethers.ZeroAddress) {
        const oppData = await contract.players(data.opponent);
        setOpponentData(oppData);
      }
    } catch (err) {
      console.error("Gagal ambil data pemain:", err);
    }
  };

  // 3. Join Game
  const joinGame = async () => {
    if (!contract) return;
    try {
      const tx = await contract.joinGame();
      await tx.wait();
      await fetchPlayerData(); // Refresh data
    } catch (err) {
      console.error("Gagal join PvP:", err);
    }
  };

  // 4. Polling data pemain setiap 3 detik
  useEffect(() => {
    if (contract && account) {
      fetchPlayerData(); // First fetch
      const interval = setInterval(fetchPlayerData, 3000);
      return () => clearInterval(interval);
    }
  }, [contract, account]);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Arena PvP</h1>
      <p className="mb-2">Status: {status}</p>

      {!playerData?.opponent && (
        <button
          onClick={joinGame}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded mb-4"
        >
          Gabung PvP
        </button>
      )}

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <h2 className="text-xl mb-2">Kamu</h2>
          {playerData ? (
            <div>
              <p>HP: {playerData.hp.toString()}</p>
              <p>Aksi terakhir: {playerData.lastAction}</p>
              <p>{playerData.isTurn ? "🚀 Giliranmu!" : "⏳ Tunggu giliran"}</p>
            </div>
          ) : (
            <p>Belum bergabung</p>
          )}
        </div>
        <div>
          <h2 className="text-xl mb-2">Lawan</h2>
          {opponentData ? (
            <div>
              <p>HP: {opponentData.hp.toString()}</p>
              <p>Aksi terakhir: {opponentData.lastAction}</p>
              <p>{opponentData.isTurn ? "🚀 Giliran lawan" : "⏳ Tunggu giliran"}</p>
            </div>
          ) : (
            <p>-</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArenaPVP;
