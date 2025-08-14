import { useCallback, useEffect, useState } from 'react';
import { useWallet } from '../../context/WalletContext.jsx';
import { getReadContract, getWriteContract } from '../../utils/contract.js';

export function useMatchmaking() {
  const { provider, signer, address } = useWallet();
  const [inQueue, setInQueue] = useState(false);
  const [battleId, setBattleId] = useState(null);

  const join = useCallback(async () => {
    const tx = await getWriteContract(signer).joinMatchmaking();
    await tx.wait();
    setInQueue(true);
  }, [signer]);

  const leave = useCallback(async () => {
    const tx = await getWriteContract(signer).leaveMatchmaking();
    await tx.wait();
    setInQueue(false);
  }, [signer]);

  useEffect(() => {
    if (!provider || !address) return;
    const cR = getReadContract(provider);
    (async () => {
      try {
        const id = await cR.activeBattleId(address);
        if (Number(id) > 0) setBattleId(Number(id));
      } catch {}
    })();
  }, [provider, address]);

  useEffect(() => {
    if (!signer || !address) return;
    const c = getWriteContract(signer);
    const handler = (id, p1, p2) => {
      if (p1?.toLowerCase() === address.toLowerCase() || p2?.toLowerCase() === address.toLowerCase()) {
        setInQueue(false);
        setBattleId(Number(id));
      }
    };
    c.on('MatchFound', handler);
    return () => c.removeListener('MatchFound', handler);
  }, [signer, address]);

  return { inQueue, setInQueue, battleId, setBattleId, join, leave };
}
