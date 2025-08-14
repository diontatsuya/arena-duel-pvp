import { useEffect } from 'react';
import { useWallet } from '../context/WalletContext.jsx';
import { getWriteContract } from '../utils/contract.js';

export default function MatchmakingPanel({ inQueue, setInQueue, onMatchFound }) {
  const { signer, address } = useWallet();

  const join = async () => {
    const tx = await getWriteContract(signer).joinMatchmaking();
    await tx.wait();
    setInQueue(true);
  };

  const leave = async () => {
    const tx = await getWriteContract(signer).leaveMatchmaking();
    await tx.wait();
    setInQueue(false);
  };

  // Listen to MatchFound events targeting our address
  useEffect(() => {
    if (!signer || !address) return;
    const c = getWriteContract(signer);
    const handler = (battleId, p1, p2) => {
      if (p1?.toLowerCase() === address.toLowerCase() || p2?.toLowerCase() === address.toLowerCase()) {
        setInQueue(false);
        onMatchFound(Number(battleId), p1, p2);
      }
    };
    c.on('MatchFound', handler);
    return () => { c.removeListener('MatchFound', handler); };
  }, [signer, address, setInQueue, onMatchFound]);

  return (
    <div className="card flex flex-col gap-4">
      <h2 className="text-lg font-bold">Matchmaking</h2>
      <p className="text-sm text-slate-300">Temukan lawan untuk duel turn-based. Klik join, tunggu match ditemukan.</p>
      <div className="flex gap-3">
        {!inQueue ? (
          <button onClick={join} className="btn-primary">Join Matchmaking</button>
        ) : (
          <>
            <span className="px-3 py-2 rounded-xl bg-amber-600/30 border border-amber-700">Searching…</span>
            <button onClick={leave} className="btn-secondary">Cancel</button>
          </>
        )}
      </div>
    </div>
  );
}
