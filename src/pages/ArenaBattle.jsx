import { useEffect, useState } from 'react';
import { useWallet } from '../context/WalletContext.jsx';
import MatchmakingPanel from '../components/MatchmakingPanel.jsx';
import BattleUI from '../components/BattleUI.jsx';
import { getReadContract, getWriteContract } from '../utils/contract.js';

export default function ArenaBattle() {
  const { provider, signer, address } = useWallet();
  const [inQueue, setInQueue] = useState(false);
  const [battleId, setBattleId] = useState(null);

  // On mount, check if already in a battle
  useEffect(() => {
    const run = async () => {
      if (!provider || !address) return;
      const c = getReadContract(provider);
      try {
        const id = await c.activeBattleId(address);
        if (Number(id) > 0) setBattleId(Number(id));
      } catch {}
    };
    run();
  }, [provider, address]);

  const handleLeaveMatchmaking = async () => {
    if (!signer) return;
    try {
      const c = getWriteContract(signer);
      const tx = await c.leaveMatchmaking();
      await tx.wait();
      setInQueue(false);
      console.log("Berhasil keluar dari matchmaking");
    } catch (err) {
      console.error("Gagal keluar:", err);
    }
  };

  return (
    <div className="grid gap-6">
      {!address && (
        <div className="card">Silakan connect wallet terlebih dahulu.</div>
      )}

      {address && battleId === null && (
        <div className="flex flex-col gap-4">
          <MatchmakingPanel
            inQueue={inQueue}
            setInQueue={setInQueue}
            onMatchFound={(id) => setBattleId(id)}
          />

          {inQueue && (
            <button
              onClick={handleLeaveMatchmaking}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Tinggalkan Matchmaking
            </button>
          )}
        </div>
      )}

      {address && battleId !== null && (
        <BattleUI battleId={battleId} />
      )}
    </div>
  );
}
