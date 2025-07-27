import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import GameStatus from "../components/ui/GameStatus";

const ArenaPVP = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [gameStatus, setGameStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionPending, setActionPending] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask!");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    setProvider(provider);
    setAccount(address);
    setContract(contract);
  };

  const joinGame = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.joinGame();
      await tx.wait();
      await fetchStatus();
    } catch (err) {
      console.error("Join error:", err);
    }
    setLoading(false);
  };

  const fetchStatus = async () => {
    if (!contract || !account) return;

    try {
      const player = await contract.getPlayerData(account);
      const opponentAddr = player.opponent;

      let opponent = null;
      if (opponentAddr !== ethers.ZeroAddress) {
        opponent = await contract.getOpponentData(opponentAddr);
      }

      setGameStatus({
        myHp: Number(player.hp),
        myTurn: player.isTurn,
        opponent: opponentAddr,
        opponentHp: opponent ? Number(opponent.hp) : null,
        myLastAction: player.lastAction,
        opponentLastAction: opponent ? opponent.lastAction : null,
      });
    } catch (err) {
      console.error("Status error:", err);
    }
  };

  const takeAction = async (actionCode) => {
    if (!contract) return;
    setActionPending(true);
    try {
      const tx = await contract.takeAction(actionCode);
      await tx.wait();
      await fetchStatus();
    } catch (err) {
      console.error("Action error:", err);
    }
    setActionPending(false);
  };

  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
      window.ethereum.on("accountsChanged", () => window.location.reload());
    }
  }, []);

  useEffect(() => {
    if (contract) {
      fetchStatus();
      const interval = setInterval(fetchStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [contract]);

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-gray-800 rounded-xl shadow-lg text-white space-y-4">
      <h1 className="text-2xl font-bold text-center">Arena PvP</h1>
      {account ? (
        <>
          <p className="text-center text-sm text-gray-300">Connected: {account}</p>
          {gameStatus ? (
            <>
              <GameStatus status={gameStatus} />
              {gameStatus.myTurn ? (
                <div className="flex justify-around mt-4">
                  <button
                    className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                    onClick={() => takeAction(1)}
                    disabled={actionPending}
                  >
                    Attack
                  </button>
                  <button
                    className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    onClick={() => takeAction(2)}
                    disabled={actionPending}
                  >
                    Defend
                  </button>
                  <button
                    className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                    onClick={() => takeAction(3)}
                    disabled={actionPending}
                  >
                    Heal
                  </button>
                </div>
              ) : (
                <p className="text-center text-yellow-400">Menunggu giliran lawan...</p>
              )}
            </>
          ) : (
            <div className="text-center">
              <button
                className="bg-purple-600 px-6 py-2 rounded hover:bg-purple-700"
                onClick={joinGame}
                disabled={loading}
              >
                {loading ? "Menunggu..." : "Gabung PvP"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center">
          <button
            className="bg-yellow-500 px-6 py-2 rounded hover:bg-yellow-600"
            onClick={connectWallet}
          >
            Hubungkan Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default ArenaPVP;
