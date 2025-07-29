import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ACTIONS = ["None", "Attack", "Defend", "Heal"];

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [status, setStatus] = useState("Menghubungkan...");
  const [isYourTurn, setIsYourTurn] = useState(false);
  const [txPending, setTxPending] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

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

  useEffect(() => {
    const fetchStatus = async () => {
      if (signer && contract) {
        try {
          const address = await signer.getAddress();
          const statusData = await contract.getStatus(address);

          const {
            battleId,
            player1,
            player2,
            turn,
            hp,
            lastAction,
            isActive
          } = statusData;

          const isPlayer1 = address.toLowerCase() === player1.toLowerCase();
          const opponentAddress = isPlayer1 ? player2 : player1;

          const playerData = {
            address,
            hp: Number(hp),
            lastAction: Number(lastAction)
          };

          const opponentData = {
            address: opponentAddress,
            hp: null,
            lastAction: null
          };

          setPlayer(playerData);
          setOpponent(opponentData);

          // Check if opponent has joined
          if (!isActive) {
            setStatus("Belum masuk pertandingan.");
            return;
          }

          if (player2 === ethers.ZeroAddress) {
            setStatus("Menunggu lawan...");
            return;
          }

          // Determine turn
          const yourTurn = (isPlayer1 && turn === 1) || (!isPlayer1 && turn === 2);
          setIsYourTurn(yourTurn);
          setStatus(yourTurn ? "Giliran kamu!" : "Giliran lawan...");

          // Game over check
          if (playerData.hp <= 0) {
            setStatus("Kamu kalah!");
            setGameOver(true);
            setWinner(opponentData.address);
          } else if (playerData.hp > 0 && playerData.lastAction === 1) {
            // Check if last turn was finishing move (optional)
            const oppStatus = await contract.getStatus(opponentData.address);
            if (Number(oppStatus.hp) <= 0) {
              setStatus("Kamu menang!");
              setGameOver(true);
              setWinner(playerData.address);
            }
          }

        } catch (err) {
          console.error("Gagal mengambil status:", err);
          setStatus("Gagal mengambil status.");
        }
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 4000);
    return () => clearInterval(interval);
  }, [signer, contract]);

  const handleAction = async (action) => {
    if (!contract || !signer || !isYourTurn || txPending || gameOver) return;

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
        <p><strong>Alamat:</strong> {data.address}</p>
        <p><strong>HP:</strong> {data.hp !== null ? data.hp : "???"}</p>
        <p><strong>Aksi Terakhir:</strong> {data.lastAction !== null ? ACTIONS[data.lastAction] : "???"}</p>
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

      {!gameOver && isYourTurn && (
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
      )}

      {gameOver && (
        <div className="mt-6 text-center text-xl text-red-400 font-bold">
          Pertandingan Selesai! {winner === player?.address ? "Kamu menang!" : "Kamu kalah!"}
        </div>
      )}

      {!isYourTurn && !gameOver && (
        <p className="mt-6 text-center text-yellow-400">Menunggu giliran lawan...</p>
      )}
    </div>
  );
};

export default ArenaPVP;
