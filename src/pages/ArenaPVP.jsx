import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import HealthBar from "../components/game/HealthBar";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [status, setStatus] = useState("Belum terhubung");
  const [playerData, setPlayerData] = useState(null);
  const [opponentData, setOpponentData] = useState(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const message = "Sign untuk Arena Duel PvP";
        await signer.signMessage(message);

        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

        setProvider(provider);
        setSigner(signer);
        setContract(contract);
        setWalletAddress(address);
        setStatus("Terhubung");

      } catch (err) {
        console.error("Gagal menghubungkan wallet:", err);
        setStatus("Gagal terhubung");
      }
    }
  };

  const fetchPlayerData = async () => {
    if (!contract || !walletAddress) return;
    const data = await contract.players(walletAddress);
    setPlayerData(data);
    if (data.opponent !== ethers.ZeroAddress) {
      const opponent = await contract.players(data.opponent);
      setOpponentData(opponent);
    } else {
      setOpponentData(null);
    }
  };

  const joinGame = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.joinGame();
      await tx.wait();
      await fetchPlayerData();
    } catch (err) {
      console.error("Join game gagal:", err);
    }
    setLoading(false);
  };

  const performAction = async (action) => {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.takeAction(action);
      await tx.wait();
      await fetchPlayerData();
    } catch (err) {
      console.error("Aksi gagal:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (contract && walletAddress) fetchPlayerData();
  }, [contract, walletAddress]);

  const renderActionButtons = () => {
    if (!playerData || !playerData.isTurn) return null;

    return (
      <div className="flex gap-4 mt-4">
        <button onClick={() => performAction(1)} className="bg-red-600 px-4 py-2 rounded">Attack</button>
        <button onClick={() => performAction(2)} className="bg-blue-600 px-4 py-2 rounded">Defend</button>
        <button onClick={() => performAction(3)} className="bg-green-600 px-4 py-2 rounded">Heal</button>
      </div>
    );
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Arena PvP</h1>
      {!walletAddress ? (
        <button onClick={connectWallet} className="bg-yellow-500 px-6 py-2 rounded">Hubungkan Wallet</button>
      ) : (
        <>
          <p>Status: {status}</p>
          <button onClick={joinGame} className="bg-purple-600 px-6 py-2 mt-2 rounded" disabled={loading}>
            Gabung PvP
          </button>

          <div className="mt-6 grid grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold">Kamu</h2>
              <p>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
              <HealthBar currentHP={playerData?.hp || 0} maxHP={100} />
              <p>Aksi: {["-", "Attack", "Defend", "Heal"][playerData?.lastAction || 0]}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Lawan</h2>
              {opponentData ? (
                <>
                  <p>{playerData?.opponent?.slice(0, 6)}...{playerData?.opponent?.slice(-4)}</p>
                  <HealthBar currentHP={opponentData?.hp || 0} maxHP={100} />
                  <p>Aksi: {["-", "Attack", "Defend", "Heal"][opponentData?.lastAction || 0]}</p>
                </>
              ) : (
                <p>Belum ada lawan</p>
              )}
            </div>
          </div>

          {renderActionButtons()}
        </>
      )}
    </div>
  );
};

export default ArenaPVP;
