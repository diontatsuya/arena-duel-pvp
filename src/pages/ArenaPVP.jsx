import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import HealthBar from "../components/ui/HealthBar";

const ArenaPVP = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [status, setStatus] = useState("Belum terhubung");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const newSigner = await newProvider.getSigner();
        const address = await newSigner.getAddress();

        const newContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, newSigner);

        setProvider(newProvider);
        setSigner(newSigner);
        setContract(newContract);
        setWalletAddress(address);
        setStatus("Terhubung");
      }
    };

    init();
  }, []);

  useEffect(() => {
    const fetchPlayers = async () => {
      if (!contract || !walletAddress) return;

      try {
        const playerData = await contract.players(walletAddress);
        const opponentAddress = playerData.opponent;

        setPlayer(playerData);

        if (opponentAddress && opponentAddress !== ethers.ZeroAddress) {
          const opponentData = await contract.players(opponentAddress);
          setOpponent(opponentData);
        } else {
          setOpponent(null);
        }
      } catch (err) {
        console.error("Gagal mengambil data pemain:", err);
      }
    };

    const interval = setInterval(fetchPlayers, 2000);
    return () => clearInterval(interval);
  }, [contract, walletAddress]);

  const handleJoinMatch = async () => {
    if (!contract) return;
    setActionLoading(true);
    try {
      const tx = await contract.joinMatch();
      await tx.wait();
    } catch (err) {
      console.error("Gagal join match:", err);
    }
    setActionLoading(false);
  };

  const handleAction = async (actionType) => {
    if (!contract) return;
    setActionLoading(true);
    try {
      const tx = await contract.performAction(actionType);
      await tx.wait();
    } catch (err) {
      console.error("Gagal melakukan aksi:", err);
    }
    setActionLoading(false);
  };

  const shorten = (addr) => addr?.slice(0, 6) + "..." + addr?.slice(-4);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Arena PvP</h1>
      <p className="mb-2">Status: {status}</p>

      {!player?.opponent || player?.opponent === ethers.ZeroAddress ? (
        <button
          onClick={handleJoinMatch}
          disabled={actionLoading}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {actionLoading ? "Menunggu..." : "Gabung PvP"}
        </button>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Player */}
          <div className="border border-gray-600 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Kamu</h2>
            <p>{shorten(walletAddress)}</p>
            <HealthBar hp={player?.hp || 0} />
            <p className="mt-1">Aksi: {["-", "Serang", "Bertahan", "Pulih"][player?.lastAction || 0]}</p>
            {player?.isTurn && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleAction(1)}
                  disabled={actionLoading}
                  className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                >
                  Serang
                </button>
                <button
                  onClick={() => handleAction(2)}
                  disabled={actionLoading}
                  className="bg-yellow-600 px-3 py-1 rounded hover:bg-yellow-700"
                >
                  Bertahan
                </button>
                <button
                  onClick={() => handleAction(3)}
                  disabled={actionLoading}
                  className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                >
                  Pulih
                </button>
              </div>
            )}
          </div>

          {/* Opponent */}
          <div className="border border-gray-600 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Lawan</h2>
            <p>{opponent ? shorten(player?.opponent) : "Belum ada lawan"}</p>
            <HealthBar hp={opponent?.hp || 0} />
            <p className="mt-1">Aksi: {["-", "Serang", "Bertahan", "Pulih"][opponent?.lastAction || 0]}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArenaPVP;
