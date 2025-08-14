import { useEffect, useState } from 'react';
import { useWallet } from '../context/WalletContext.jsx';
import MatchmakingPanel from '../components/MatchmakingPanel.jsx';
import BattleUI from '../components/BattleUI.jsx';
import { getReadContract } from '../utils/contract.js';

export default function ArenaBattle() {
  const { provider, address } = useWallet();
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

  return (
    <div className="grid gap-6">
      {!address && (
        <div className="card">Silakan connect wallet terlebih dahulu.</div>
      )}

      {address && battleId === null && (
        <MatchmakingPanel inQueue={inQueue} setInQueue={setInQueue} onMatchFound={(id) => setBattleId(id)} />
      )}

      {address && battleId !== null && (
        <BattleUI battleId={battleId} />
      )}
    </div>
  );
}
