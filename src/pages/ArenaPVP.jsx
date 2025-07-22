import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";
import WalletStatus from "../components/ui/WalletStatus";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [playerData, setPlayerData] = useState(null);
  const [opponentData, setOpponentData] = useState(null);

  // Setup provider, signer, and contract
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const tempProvider = new ethers.BrowserProvider(window.ethereum);
        const tempSigner = await tempProvider.getSigner();
        const tempContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, tempSigner);
        const tempAddress = await tempSigner.getAddress();

        setProvider(tempProvider);
        setSigner(tempSigner);
        setContract(tempContract);
        setUserAddress(tempAddress);
      }
    };
    init();
  }, []);

  // Fetch player and opponent data
  useEffect(() => {
    const fetchPlayerData = async () => {
      if (!contract || !userAddress) return;

      try {
        const player = await contract.players(userAddress);
        setPlayerData(player);

        if (player.opponent !== ethers.ZeroAddress) {
          const opponent = await contract.players(player.opponent);
          setOpponentData(opponent);
        } else {
          setOpponentData(null);
        }
      } catch (err) {
        console.error("Error fetching player data:", err);
      }
    };

    fetchPlayerData();
    const interval = setInterval(fetchPlayerData, 5000); // Refresh data setiap 5 detik
    return () => clearInterval(interval);
  }, [contract, userAddress]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-6">Arena PvP</h1>
      <WalletStatus />

      {!playerData ? (
        <p className="text-gray-400">Memuat status duel kamu...</p>
      ) : playerData.opponent === ethers.ZeroAddress ? (
        <p className="text-yellow-400">🔄 Menunggu lawan untuk duel...</p>
      ) : (
        <div className="bg-gray-800 p-4 rounded-lg w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">🧙 Status Duel</h2>
          <p><strong>Kamu:</strong> {userAddress}</p>
          <p><strong>HP:</strong> {playerData.hp.toString()}</p>
          <p><strong>Aksi Terakhir:</strong> {Object.keys(playerData.lastAction)[0]}</p>
          <p><strong>Giliran Kamu:</strong> {playerData.isTurn ? "✅ Ya" : "❌ Tidak"}</p>
          <hr className="my-4 border-gray-600" />
          <p><strong>Lawan:</strong> {playerData.opponent}</p>
          <p><strong>HP Lawan:</strong> {opponentData?.hp.toString()}</p>
          <p><strong>Aksi Lawan Terakhir:</strong> {Object.keys(opponentData?.lastAction || [])[0]}</p>
        </div>
      )}
    </div>
  );
};

export default ArenaPVP;
