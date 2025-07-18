import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../utils/contractABI";
import HealthBar from "../components/HealthBar";

const ACTIONS = ["None", "Attack", "Defend", "Heal"];

const Home = ({ signer, address }) => {
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [txStatus, setTxStatus] = useState("");
  const [events, setEvents] = useState([]);

  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  // Ambil status player dan lawan
  const fetchStatus = async () => {
    try {
      const playerData = await contract.players(address);
      if (playerData.opponent !== ethers.constants.AddressZero) {
        const opponentData = await contract.players(playerData.opponent);
        setPlayer(playerData);
        setOpponent(opponentData);
      } else {
        setPlayer(playerData);
        setOpponent(null);
      }
    } catch (err) {
      console.error("Gagal fetch status:", err);
    }
  };

  // Gabung game
  const joinGame = async () => {
    try {
      setIsLoading(true);
      const tx = await contract.joinGame();
      setTxStatus("Menunggu konfirmasi...");
      await tx.wait();
      setTxStatus("Berhasil bergabung!");
      fetchStatus();
    } catch (err) {
      console.error(err);
      setTxStatus("Gagal join game.");
    } finally {
      setIsLoading(false);
    }
  };

  // Ambil data event
  const listenToEvents = () => {
    contract.on("Matched", (player, opponent) => {
      setEvents((prev) => [
        ...prev,
        `Matched: ${player.slice(0, 6)} vs ${opponent.slice(0, 6)}`
      ]);
      fetchStatus();
    });

    contract.on("ActionTaken", (player, action, playerHp, opponentHp) => {
      const actionText = ACTIONS[action];
      setEvents((prev) => [
        ...prev,
        `${player.slice(0, 6)} melakukan ${actionText}`
      ]);
      fetchStatus();
    });
  };

  const takeAction = async (action) => {
    try {
      setIsLoading(true);
      const tx = await contract.takeAction(action);
      setTxStatus("Transaksi terkirim...");
      await tx.wait();
      setTxStatus("Aksi berhasil!");
    } catch (err) {
      console.error(err);
      setTxStatus("Gagal melakukan aksi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (signer && address) {
      fetchStatus();
      listenToEvents();
    }
    // Cleanup event listener
    return () => {
      contract.removeAllListeners();
    };
  }, [signer, address]);

  return (
    <div className="max-w-xl mx-auto mt-10 text-center">
      <h1 className="text-3xl font-bold mb-6">Arena Duel PvP</h1>

      {!player?.opponent ? (
        <div>
          <p className="mb-4">Belum ada lawan, klik tombol di bawah untuk bergabung.</p>
          <button
            onClick={joinGame}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            {isLoading ? "Menunggu..." : "Join Game"}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="font-bold">Kamu</h2>
              <HealthBar hp={player.hp} />
              <p>Aksi terakhir: {ACTIONS[player.lastAction]}</p>
              <p>{player.isTurn ? "🎯 Giliranmu" : "⏳ Tunggu giliran"}</p>
            </div>
            <div>
              <h2 className="font-bold">Lawan</h2>
              <HealthBar hp={opponent.hp} />
              <p>Aksi terakhir: {ACTIONS[opponent.lastAction]}</p>
              <p>{opponent.isTurn ? "🎯 Giliran lawan" : "⏳ Menunggu"}</p>
            </div>
          </div>

          {player.isTurn && (
            <div className="space-x-4">
              <button
                onClick={() => takeAction(1)}
                className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
              >
                Attack
              </button>
              <button
                onClick={() => takeAction(2)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-xl hover:bg-yellow-600"
              >
                Defend
              </button>
              <button
                onClick={() => takeAction(3)}
                className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
              >
                Heal
              </button>
            </div>
          )}

          {txStatus && <p className="text-sm text-gray-500">{txStatus}</p>}
        </div>
      )}

      {events.length > 0 && (
        <div className="mt-6 text-left bg-gray-100 p-4 rounded-xl">
          <h3 className="font-semibold mb-2">Riwayat Pertarungan:</h3>
          <ul className="text-sm space-y-1">
            {events.slice().reverse().map((log, index) => (
              <li key={index}>• {log}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;
