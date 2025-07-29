import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import HealthBar from "../components/ui/HealthBar";

const ACTIONS = ["None", "Attack", "Defend", "Heal"];

const ArenaPVP = () => {
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("Menghubungkan...");
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [isYourTurn, setIsYourTurn] = useState(false);
  const [txPending, setTxPending] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  // Inisialisasi koneksi ke wallet dan kontrak
  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) {
        setStatus("MetaMask tidak ditemukan");
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signerObj = await provider.getSigner();
      const addr = await signerObj.getAddress();
      const contractObj = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signerObj);
      setSigner(signerObj);
      setAddress(addr);
      setContract(contractObj);
    };
    init();
  }, []);

  // Update status game
  useEffect(() => {
    if (!contract || !signer || !address) return;

    const fetch = async () => {
      try {
        const data = await contract.getStatus(address);
        const { player1, player2, turn, hp, lastAction, isActive } = data;

        if (!isActive) {
          setStatus("Belum masuk pertandingan.");
          setPlayer(null);
          setOpponent(null);
          return;
        }

        if (player2 === ethers.ZeroAddress) {
          setStatus("Menunggu lawan...");
          return;
        }

        const isP1 = address.toLowerCase() === player1.toLowerCase();
        const opponentAddr = isP1 ? player2 : player1;

        // Pemain
        const self = { address, hp: Number(hp), lastAction: Number(lastAction) };

        // Lawan
        let opp = null;
        try {
          const oppData = await contract.getStatus(opponentAddr);
          opp = {
            address: opponentAddr,
            hp: Number(oppData.hp),
            lastAction: Number(oppData.lastAction),
          };
        } catch (err) {
          console.warn("Gagal ambil data lawan.");
        }

        setPlayer(self);
        setOpponent(opp);

        if (self.hp <= 0 || (opp && opp.hp <= 0)) {
          const youWin = self.hp > (opp?.hp || 0);
          setGameOver(true);
          setWinner(youWin ? address : opponentAddr);
          setStatus(youWin ? "Kamu menang!" : "Kamu kalah!");
        } else {
          if (turn === 0) {
            setStatus("Menunggu giliran pertama...");
            setIsYourTurn(false);
            return;
          }

          const yourTurn = (isP1 && turn === 1) || (!isP1 && turn === 2);
          setIsYourTurn(yourTurn);
          setStatus(yourTurn ? "Giliran kamu!" : "Giliran lawan...");
        }
      } catch (err) {
        console.error("Gagal ambil status:", err);
        setStatus("Gagal ambil status.");
      }
    };

    fetch();
    const interval = setInterval(fetch, 4000);
    return () => clearInterval(interval);
  }, [contract, signer, address]);

  const handleAction = async (action) => {
    if (!contract || !isYourTurn || txPending || gameOver) return;
    setTxPending(true);
    try {
      const tx = await contract.takeTurn(action);
      await tx.wait();
    } catch (err) {
      console.error("Aksi gagal", err);
    }
    setTxPending(false);
  };

  const renderPlayer = (title, data) => {
    if (!data) return <div className="p-4 text-gray-400">Loading {title}...</div>;
    return (
      <div className="p-4 bg-gray-800 rounded shadow w-full md:w-1/2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <HealthBar label={title} hp={Math.min(data.hp, 100)} maxHp={100} />
        <p>HP: {data.hp}</p>
        <p>Aksi terakhir: {ACTIONS[data.lastAction]}</p>
      </div>
    );
  };

  return (
    <div className="p-6 mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-center mb-4">Arena PvP</h1>
      <p className="text-center mb-6">{status}</p>

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
    </div>
  );
};

export default ArenaPVP;
