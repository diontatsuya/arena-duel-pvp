import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWallet } from '../../context/WalletContext.jsx';
import { getReadContract, getWriteContract } from '../../utils/contract.js';

export function useBattle(battleId) {
  const { provider, signer, address } = useWallet();
  const [battle, setBattle] = useState(null);
  const [myTurn, setMyTurn] = useState(false);
  const [result, setResult] = useState(null);

  const readC = useMemo(() => provider && getReadContract(provider), [provider]);
  const writeC = useMemo(() => signer && getWriteContract(signer), [signer]);

  const fetchBattle = useCallback(async () => {
    if (!readC) return;
    const b = await readC.getBattle(battleId);
    setBattle(b);
    if (address) {
      const amP1 = b.player1?.toLowerCase() === address.toLowerCase();
      setMyTurn(Boolean(amP1 ? b.isPlayer1Turn : !b.isPlayer1Turn));
    }
  }, [readC, battleId, address]);

  const takeAction = useCallback(async (action) => {
    const tx = await writeC.takeAction(action);
    await tx.wait();
    fetchBattle();
  }, [writeC, fetchBattle]);

  useEffect(() => {
    fetchBattle();
    const t = setInterval(fetchBattle, 5000);
    return () => clearInterval(t);
  }, [fetchBattle]);

  useEffect(() => {
    if (!writeC) return;
    const onAction = (id) => { if (Number(id) === Number(battleId)) fetchBattle(); };
    const onEnd = (id, winner) => {
      if (Number(id) !== Number(battleId)) return;
      if (winner?.toLowerCase() === address?.toLowerCase()) setResult('win'); else setResult('lose');
      fetchBattle();
    };
    writeC.on('ActionTaken', onAction);
    writeC.on('BattleEnded', onEnd);
    writeC.on('BattleFinished', onEnd);
    return () => {
      writeC.removeListener('ActionTaken', onAction);
      writeC.removeListener('BattleEnded', onEnd);
      writeC.removeListener('BattleFinished', onEnd);
    };
  }, [writeC, battleId, address, fetchBattle]);

  return { battle, myTurn, result, takeAction, refetch: fetchBattle };
}
