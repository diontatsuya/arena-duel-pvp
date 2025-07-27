import { useEffect, useState } from "react";

const GameStatus = ({ contract, address }) => {
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [isTurn, setIsTurn] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    if (!contract || !address) return;

    try {
      const data = await contract.players(address);
      setPlayer(data);
      if (data.opponent !== "0x0000000000000000000000000000000000000000") {
        const opp = await contract.players(data.opponent);
        setOpponent(opp);
      } else {
        setOpponent(null);
      }

      setIsTurn(data.isTurn);
      setLoading(false);

      // Cek kemenangan
      if (data.hp === 0) {
        setStatusMessage("😵 Kamu kalah! Menunggu reset...");
        await contract.resetGame();
      } else if (opponent && opponent.hp === 0) {
        setStatusMessage("🏆 Kamu menang! Menunggu reset...");
        await contract.resetGame();
      } else if (data.opponent === "0x0000000000000000000000000000000000000000") {
        setStatusMessage("🔍 Menunggu lawan...");
      } else {
        setStatusMessage(data.isTurn ? "🎯 Giliran kamu!" : "⏳ Menunggu giliran lawan...");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Gagal memuat status.");
    }
  };

  const handleAction = async (action) => {
    if (!contract || !address) return;
    try {
      const tx = await contract.takeTurn(action);
      await tx.wait();
      await fetchStatus();
    } catch (err) {
      console.error("Gagal mengambil aksi:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [contract, address]);

  if (loading) return <div>⏳ Memuat status...</div>;

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-2">Status Pertandingan</h2>
      <p><strong>Kamu:</strong> {player?.hp ?? "-"} HP</p>
      <p><strong>Lawan:</strong> {opponent?.hp ?? "?"} HP</p>
      <p className="mt-2 text-yellow-400">{statusMessage}</p>

      {isTurn && (
        <div className="mt-4 flex gap-2">
          <button onClick={() => handleAction(1)} className="px-3 py-1 bg-red-600 rounded hover:bg-red-700">Attack</button>
          <button onClick={() => handleAction(2)} className="px-3 py-1 bg-green-600 rounded hover:bg-green-700">Defend</button>
          <button onClick={() => handleAction(3)} className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700">Heal</button>
        </div>
      )}
    </div>
  );
};

export default GameStatus;
