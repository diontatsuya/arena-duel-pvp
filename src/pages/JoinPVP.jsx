import { useEffect, useState } from "react";
import { connectWallet } from "../utils/connectWallet";
import { checkBattleStatus } from "../gameLogic/pvp/checkBattleStatus";
import { joinMatchmaking } from "../gameLogic/pvp/joinMatchmaking";
import { leaveMatchmaking } from "../gameLogic/pvp/leaveMatchmaking";
import WaitingMatch from "../components/pvp/WaitingMatch";

const JoinPVP = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [battleStatus, setBattleStatus] = useState("idle");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      const address = await connectWallet();
      setWalletAddress(address);

      const status = await checkBattleStatus(address);
      setBattleStatus(status);
    };

    fetchStatus();
  }, []);

  const joinMatch = async () => {
    setLoading(true);
    try {
      await joinMatchmaking(walletAddress);
      setBattleStatus("waiting");
    } catch (error) {
      console.error("Error joining matchmaking:", error);
    }
    setLoading(false);
  };

  const leaveBattle = async () => {
    setLoading(true);
    try {
      await leaveMatchmaking(walletAddress);
      setBattleStatus("idle");
    } catch (error) {
      console.error("Error leaving matchmaking:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center w-96">
        <h1 className="text-2xl font-bold mb-6">PvP Arena</h1>

        {battleStatus === "idle" && (
          <button
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg mb-4 disabled:opacity-50"
            onClick={joinMatch}
            disabled={loading}
          >
            {loading ? "Joining..." : "Join Matchmaking"}
          </button>
        )}

        {battleStatus === "waiting" && (
          <>
            <button
              className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-lg mb-4 disabled:opacity-50"
              onClick={leaveBattle}
              disabled={loading}
            >
              {loading ? "Leaving..." : "Batalkan Match"}
            </button>

            {/* ⬇️ Tambahkan komponen yang menangani polling match */}
            <WaitingMatch playerAddress={walletAddress} />
          </>
        )}

        {battleStatus === "inBattle" && (
          <p className="text-lg text-green-400 mb-4">Anda sedang dalam battle!</p>
        )}
      </div>
    </div>
  );
};

export default JoinPVP;
