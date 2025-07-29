import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ACTIONS = ["-", "Serang", "Bertahan", "Heal"];

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState(null);

  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);

  const [status, setStatus] = useState("Menyiapkan...");
  const [isYourTurn, setIsYourTurn] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [txPending, setTxPending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) {
        setStatus("MetaMask tidak ditemukan");
        return;
      }

      try {
        const prov = new ethers.providers.Web3Provider(window.ethereum);
        const sign = prov.getSigner();
        const addr = await sign.getAddress();
        const cont = new ethers.Contract(CONTRACT_ADDRESS, contractABI, sign);

        setProvider(prov);
        setSigner(sign);
        setAddress(addr);
        setContract(cont);
      } catch (err) {
        setStatus("Gagal menghubungkan wallet");
        console.error(err);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (!contract || !address) return;

    fetchGameData(); // fetch pertama

    const interval = setInterval(fetchGameData, 4000); // polling
    return () => clearInterval(interval);
  }, [contract, address]);

  const fetchGameData = async () => {
    try {
      const game = await contract.getPlayerBattle(address);

      const isEmpty = game.player1 === ethers.constants.AddressZero;
      const isDone = game.winner !== ethers.constants.AddressZero;

      if (isEmpty) {
        setStatus("Kamu belum masuk pertandingan.");
        setPlayer(null);
        setOpponent(null);
        setLoading(false);
        return;
      }

      // Tetapkan player & lawan
      const isPlayer1 = game.player1.toLowerCase() === address.toLowerCase();
      setPlayer(isPlayer1 ? game.player1Data : game.player2Data);
      setOpponent(isPlayer1 ? game.player2Data : game.player1Data);

      setIsYourTurn(game.turn.toLowerCase() === address.toLowerCase());
      setGameOver(isDone);
      setWinner(game.winner);

      if (isDone) {
        setStatus("Pertandingan selesai!");
      } else if (game.player2 === ethers.constants.AddressZero) {
        setStatus("Menunggu lawan bergabung...");
      } else {
        setStatus(game.turn.toLowerCase() === address.toLowerCase() ? "Giliran kamu!" : "Menunggu giliran lawan...");
      }

      setLoading(false);
    } catch (error) {
      console.error("Gagal ambil data pertandingan:", error);
      setStatus("Gagal ambil status pertandingan.");
      setLoading(false);
    }
  };

  const handleAction = async (actionType) => {
    if (!contract || !address) return;

    try {
      setTxPending(true);
      const tx = await contract.performAction(actionType);
      await tx.wait();
      fetchGameData();
    } catch (error) {
      console.error("Gagal melakukan aksi:", error);
    } finally {
      setTxPending(false);
    }
  };

  const renderPlayer = (title, data) => {
    return (
      <div className="flex-1 p-4 border rounded-lg bg-gray-800">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        {data ? (
          <>
            <p>HP: {data.hp.toString()}</p>
            <p>Aksi Terakhir: {ACTIONS[Number(data.lastAction)]}</p>
          </>
        ) : (
          <p>Belum ada data.</p>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-center mb-4">Arena PvP</h1>
      <p className="text-center mb-6">{status}</p>

      {loading ? (
        <p className="text-center text-gray-400">Mengambil data pertandingan...</p>
      ) : !player ? (
        <p className="text-center text-gray-400">Belum bergabung ke pertandingan.</p>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4">
            {renderPlayer("Kamu", player)}
            {renderPlayer("Lawan", opponent)}
          </div>

          {!gameOver && isYourTurn && (
            <div className="mt-6 flex justify-center gap-4">
              <button disabled={txPending} onClick={() => handleAction(1)} className="btn-red">
                Serang
              </button>
              <button disabled={txPending} onClick={() => handleAction(2)} className="btn-blue">
                Bertahan
              </button>
              <button disabled={txPending} onClick={() => handleAction(3)} className="btn-green">
                Heal
              </button>
            </div>
          )}

          {gameOver && (
            <div className="mt-6 text-center text-xl text-yellow-300">
              {winner?.toLowerCase() === address?.toLowerCase()
                ? "🎉 Kamu menang!"
                : "😢 Kamu kalah!"}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ArenaPVP;
