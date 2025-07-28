import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [status, setStatus] = useState("Menunggu lawan...");
  const [isYourTurn, setIsYourTurn] = useState(false);

  const [txPending, setTxPending] = useState(false);

  // Hubungkan ke wallet dan kontrak
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const newSigner = await newProvider.getSigner();
        const newContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, newSigner);

        setProvider(newProvider);
        setSigner(newSigner);
        setContract(newContract);
      }
    };

    init();
  }, []);

  // Ambil status pemain
  useEffect(() => {
    const fetchStatus = async () => {
      if (signer && contract) {
        const address = await signer.getAddress();

        try {
          const playerData = await contract.getPlayer(address);
          const opponentAddr = await contract.getOpponent(address);
          const opponentData = await contract.getPlayer(opponentAddr);

          setPlayer({ address, ...playerData });
          setOpponent({ address: opponentAddr, ...opponentData });

          if (playerData.opponent === ethers.ZeroAddress) {
            setStatus("Menunggu lawan...");
          } else {
            setStatus("Pertandingan dimulai!");
            setIsYourTurn(playerData.isTurn);
          }
        } catch (err) {
          console.error("Gagal ambil status pemain:", err);
        }
      }
    };

    fetchStatus();

    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [signer, contract]);

  const handleAction = async (action) => {
    if (!contract || !signer || !isYourTurn || txPending) return;

    try {
      setTxPending(true);
      const tx = await contract.takeTurn(action);
      await tx.wait();
    } catch (err) {
      console.error("Aksi gagal:", err);
    } finally {
      setTxPending(false);
    }
  };

  const renderPlayer = (data, title) => {
    if (!data) return null;
    return (
      <div className="p-4 bg-gray-800 rounded-lg shadow w-full md:w-1/2 mb-4">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p><strong>HP:</strong> {Number(data.hp)}</p>
        <p><strong>Aksi Terakhir:</strong> {["None", "Attack", "Defend", "Heal"][Number(data.lastAction)]}</p>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Arena PvP</h1>
      <p className="text-center text-lg mb-6">{status}</p>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        {renderPlayer(player, "Kamu")}
        {renderPlayer(opponent, "Lawan")}
      </div>

      {isYourTurn ? (
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => handleAction(1)}
            disabled={txPending}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
          >
            Serang
          </button>
          <button
            onClick={() => handleAction(2)}
            disabled={txPending}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Bertahan
          </button>
          <button
            onClick={() => handleAction(3)}
            disabled={txPending}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
          >
            Heal
          </button>
        </div>
      ) : (
        <p className="mt-6 text-center text-yellow-400">Menunggu giliran lawan...</p>
      )}
    </div>
  );
};

export default ArenaPVP;
