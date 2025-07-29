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

  useEffect(() => {
    if (!contract || !signer) return;
    const fetch = async () => {
      try {
        const data = await contract.getStatus(address);
        const { player1, player2, turn, hp, lastAction, isActive } = data;

        if (!isActive) {
          setStatus("Belum masuk pertandingan.");
          return;
        }
        if (player2 === ethers.ZeroAddress) {
          setStatus("Menunggu lawan...");
          return;
        }

        const is1 = address.toLowerCase() === player1.toLowerCase();
        const oppAddr = is1 ? player2 : player1;

        const own = { address, hp: Number(hp), lastAction: Number(lastAction) };
        const oppData = await contract.getStatus(oppAddr);
        const opp = { address: oppAddr, hp: Number(oppData.hp), lastAction: Number(oppData.lastAction) };

        setPlayer(own);
        setOpponent(opp);

        if (own.hp <= 0 || opp.hp <= 0) {
          const youWin = own.hp > opp.hp;
          setGameOver(true);
          setWinner(youWin ? address : oppAddr);
          setStatus(youWin ? "Kamu menang!" : "Kamu kalah!");
        } else {
          const yourTurn = (is1 && turn === 1) || (!is1 && turn === 2);
          setIsYourTurn(yourTurn);
          setStatus(yourTurn ? "Giliran kamu!" : "Giliran lawan...");
        }
      } catch (err) {
        console.error(err);
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
    if (!data) return <div className="p-4">Loading {title}...</div>;
    return (
      <div className="p-4 bg-gray-800 rounded shadow w-full md:w-1/2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <HealthBar label={title} hp={data.hp} maxHp={100} />
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
          <button disabled={txPending} onClick={() => handleAction(1)} className="btn-red">Serang</button>
          <button disabled={txPending} onClick={() => handleAction(2)} className="btn-blue">Bertahan</button>
          <button disabled={txPending} onClick={() => handleAction(3)} className="btn-green">Heal</button>
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
