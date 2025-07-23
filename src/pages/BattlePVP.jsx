import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import HealthBar from "../components/ui/HealthBar";

const BattlePVP = () => {
  const { state } = useLocation();
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [playerStatus, setPlayerStatus] = useState(null);
  const [opponentStatus, setOpponentStatus] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const playerAddress = state?.player;

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        const _signer = await _provider.getSigner();
        const _contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, _signer);
        setProvider(_provider);
        setSigner(_signer);
        setContract(_contract);
      }
    };
    init();
  }, []);

  const fetchStatus = async () => {
    if (!contract || !playerAddress) return;

    try {
      const player = await contract.players(playerAddress);
      const opponent = await contract.players(player.opponent);

      setPlayerStatus(player);
      setOpponentStatus(opponent);
    } catch (err) {
      console.error("Gagal fetch status:", err);
    }
  };

  const handleAction = async (actionCode) => {
    if (!contract || actionInProgress) return;
    setActionInProgress(true);
    setStatusMessage("Mengirim aksi...");

    try {
      const tx = await contract.performAction(actionCode);
      await tx.wait();
      setStatusMessage("Aksi berhasil!");
    } catch (err) {
      console.error(err);
      setStatusMessage("Aksi gagal!");
    } finally {
      setActionInProgress(false);
      fetchStatus();
    }
  };

  useEffect(() => {
    if (contract) fetchStatus();
  }, [contract]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pertarungan PvP</h1>

      {playerStatus && opponentStatus ? (
        <>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Kamu</h2>
              <HealthBar hp={Number(playerStatus.hp)} />
              <p className="text-sm">Aksi terakhir: {playerStatus.lastAction}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Lawan</h2>
              <HealthBar hp={Number(opponentStatus.hp)} />
              <p className="text-sm">Aksi terakhir: {opponentStatus.lastAction}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <button
              onClick={() => handleAction(1)}
              disabled={actionInProgress}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
              Serang
            </button>
            <button
              onClick={() => handleAction(2)}
              disabled={actionInProgress}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
            >
              Bertahan
            </button>
            <button
              onClick={() => handleAction(3)}
              disabled={actionInProgress}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
            >
              Heal
            </button>
          </div>

          <p>{statusMessage}</p>
        </>
      ) : (
        <p>Memuat status pemain...</p>
      )}
    </div>
  );
};

export default BattlePVP;
