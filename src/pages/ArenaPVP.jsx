import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";
import GameStatus from "../components/ui/GameStatus";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState("Belum terhubung");
  const [playerData, setPlayerData] = useState(null);
  const [opponentData, setOpponentData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Hubungkan wallet
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const tempProvider = new ethers.BrowserProvider(window.ethereum);
        const tempSigner = await tempProvider.getSigner();
        const accounts = await tempProvider.send("eth_requestAccounts", []);
        const tempContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, tempSigner);

        setProvider(tempProvider);
        setSigner(tempSigner);
        setContract(tempContract);
        setAccount(accounts[0]);
        setStatus("Terhubung");
      } else {
        alert("MetaMask tidak ditemukan!");
      }
    } catch (error) {
      console.error("Gagal menghubungkan wallet:", error);
    }
  };

  // Gabung PvP
  const handleJoinMatch = async () => {
    if (!contract || !account) {
      alert("Hubungkan wallet terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.joinMatch();
      await tx.wait();
      setStatus("Bergabung ke pertandingan...");
      fetchPlayerData();
    } catch (err) {
      console.error("Gagal join match:", err);
      alert("Gagal join match.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayerData = async () => {
    if (!contract || !account) return;

    try {
      const player = await contract.players(account);
      setPlayerData(player);

      if (player.opponent !== ethers.ZeroAddress) {
        const opponent = await contract.players(player.opponent);
        setOpponentData(opponent);
        setStatus("Bertanding!");
      } else {
        setStatus("Menunggu lawan...");
      }
    } catch (err) {
      console.error("Gagal mengambil data pemain:", err);
    }
  };

  // Ambil data saat wallet berubah
  useEffect(() => {
    if (account && contract) {
      fetchPlayerData();
    }
  }, [account, contract]);

  return (
    <div className="p-4 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">Arena PvP</h1>

      <p className="mb-2">Status: <span className="font-semibold">{status}</span></p>

      {!account ? (
        <button
          onClick={connectWallet}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Hubungkan Wallet
        </button>
      ) : (
        <button
          onClick={handleJoinMatch}
          disabled={loading}
          className={`bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded ${loading && "opacity-50"}`}
        >
          {loading ? "Memproses..." : "Gabung PvP"}
        </button>
      )}

      <GameStatus
        account={account}
        playerData={playerData}
        opponentData={opponentData}
      />
    </div>
  );
};

export default ArenaPVP;
