import { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";
import { checkBattleStatus } from "../gameLogic/pvp/checkBattleStatus";
import { useJoinMatchmaking } from "../gameLogic/pvp/JoinMatchMaking";
import { useLeaveMatchmaking } from "../gameLogic/pvp/LeaveMatchMaking";
import WaitingMatch from "../components/pvp/WaitingMatch";

const JoinPVP = () => {
  const { walletAddress, signer, connectWallet } = useWallet();
  const { joinMatchmaking } = useJoinMatchmaking();
  const { leaveMatchmaking } = useLeaveMatchmaking();
  const [battleStatus, setBattleStatus] = useState("idle");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!walletAddress || !signer) {
        await connectWallet();
      }

      const battleId = await checkBattleStatus(walletAddress, signer);

      if (battleId) {
        setBattleStatus("inBattle");
      } else {
        setBattleStatus("idle");
      }
    };

    fetchStatus();
  }, [walletAddress, signer]);

  const joinMatch = async () => {
    setLoading(true);
    try {
      const success = await joinMatchmaking();  // ✅ tanpa parameter signer
      if (success) {
        setBattleStatus("waiting");
      }
    } catch (error) {
      console.error("Error joining matchmaking:", error);
    }
    setLoading(false);
  };

  const leaveBattle = async () => {
    setLoading(true);
    try {
      const success = await leaveMatchmaking();  // ✅ tanpa parameter signer
      if (success) {
        setBattleStatus("idle");
      }
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
