// src/pages/ArenaPVP.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";
import HealthBar from "../components/ui/HealthBar";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [opponentData, setOpponentData] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [loading, setLoading] = useState(false);

  const getPlayerInfo = async (address) => {
    const data = await contract.players(address);
    return {
      hp: parseInt(data.hp),
      isTurn: data.isTurn,
      lastAction: data.lastAction,
      opponent: data.opponent,
    };
  };

  const fetchGameData = async (account) => {
    const me = await getPlayerInfo(account);
    setPlayerData(me);

    if (me.opponent !== ethers.constants.AddressZero) {
      const opp = await getPlayerInfo(me.opponent);
      setOpponentData(opp);
    }

    setIsMyTurn(me.isTurn);
  };

  const performAction = async (actionType) => {
    if (!contract || !signer) return;
    setLoading(true);
    try {
      const tx = await contract.takeAction(actionType);
      await tx.wait();
      const account = await signer.getAddress();
      await fetchGameData(account);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const prov = new ethers.providers.Web3Provider(window.ethereum);
        await prov.send("eth_requestAccounts", []);
        const sign = prov.getSigner();
        const cont = new ethers.Contract(CONTRACT_ADDRESS, contractABI, sign);
        setProvider(prov);
        setSigner(sign);
        setContract(cont);
        const account = await sign.getAddress();
        await fetchGameData(account);
      }
    };
    init();
  }, []);

  if (!playerData) return <div className="p-4">Loading player data...</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Arena PvP</h2>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold">You</h3>
          <HealthBar hp={playerData.hp} />
          <p className="text-sm">Last Action: {playerData.lastAction}</p>
        </div>
        <div>
          <h3 className="font-semibold">Opponent</h3>
          {opponentData ? (
            <>
              <HealthBar hp={opponentData.hp} />
              <p className="text-sm">Last Action: {opponentData.lastAction}</p>
            </>
          ) : (
            <p>Waiting for opponent...</p>
          )}
        </div>
      </div>

      <div className="space-x-4">
        {isMyTurn ? (
          <>
            <button
              onClick={() => performAction(1)}
              className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
              disabled={loading}
            >
              Attack
            </button>
            <button
              onClick={() => performAction(2)}
              className="px-4 py-2 bg-yellow-500 rounded hover:bg-yellow-600"
              disabled={loading}
            >
              Defend
            </button>
            <button
              onClick={() => performAction(3)}
              className="px-4 py-2 bg-green-500 rounded hover:bg-green-600"
              disabled={loading}
            >
              Heal
            </button>
          </>
        ) : (
          <p>Waiting for your turn...</p>
        )}
      </div>
    </div>
  );
};

export default ArenaPVP;
