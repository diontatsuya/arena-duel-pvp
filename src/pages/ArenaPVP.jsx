import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

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

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const prov = new ethers.providers.Web3Provider(window.ethereum);
        const sign = prov.getSigner();
        const addr = await sign.getAddress();
        const cont = new ethers.Contract(CONTRACT_ADDRESS, contractABI, sign);

        setProvider(prov);
        setSigner(sign);
        setAddress(addr);
        setContract(cont);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!contract || !address) return;
    fetchGameData();

    const interval = setInterval(fetchGameData, 3000);
    return () => clearInterval(interval);
  }, [contract, address]);

  const fetchGameData = async () => {
    try {
      const game = await contract.getPlayerBattle(address);

      if (!game || game.player1 === ethers.constants.AddressZero) {
        setStatus("Kamu belum bergabung ke pertandingan.");
        setPlayer(null);
        setOpponent(null);
        return;
      }

      setPlayer(game.player1 === address ? game.player1Data : game.player2Data);
      setOpponent(game.player1 === address ? game.player2Data : game.player1Data);

      setIsYourTurn(game.turn === address);
      setGameOver(game.winner !== ethers.constants.AddressZero);
      setWinner(game.winner);

      if (game.winner !== ethers.constants.AddressZero) {
        setStatus("Pertandingan selesai!");
      } else if (game.player1 !== ethers.constants.AddressZero && game.player2 === ethers.constants.AddressZero) {
        setStatus("Menunggu lawan...");
      } else {
        setStatus(game.turn === address ? "Giliranmu!" : "Menunggu giliran lawan...");
      }
    } catch (error) {
      console.error("Error fetch game data:", error);
    }
  };

  const handleAction = async (actionType) => {
    if (!contract || !address) return;

    try {
      setTxPending(true);
      const tx = await contract.performAction(actionType);
      await tx.wait();
      setTxPending(false);
      fetchGameData();
    } catch (error) {
      console.error("Error performing action:", error);
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
            <p>Aksi Terakhir: {parseAction(data.lastAction)}</p>
          </>
        ) : (
          <p>Belum ada data.</p>
        )}
      </div>
    );
  };

  const parseAction = (code) => {
    const action = Number(code);
    if (action === 1) return "Serang";
    if (action === 2) return "Bertahan";
    if (action === 3) return "Heal";
    return "-";
  };

  return (
    <div className="p-6 mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-center mb-4">Arena PvP</h1>
      <p className="text-center mb-6">{status}</p>

      {!player && !opponent ? (
        <p className="text-center text-gray-400">Mengambil data pertandingan...</p>
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
              {winner === address ? "🎉 Kamu menang!" : "😢 Kamu kalah!"}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ArenaPVP;
