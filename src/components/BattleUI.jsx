import { useEffect, useMemo, useState } from 'react';
import { useWallet } from '../context/WalletContext.jsx';
import { getReadContract, getWriteContract } from '../utils/contract.js';
import HealthBar from './HealthBar.jsx';
import ActionButtons from './ActionButtons.jsx';
import { useNavigate } from 'react-router-dom'; // ✅ tambahkan ini

export default function BattleUI({ battleId }) {
  const { signer, provider, address } = useWallet();
  const [battle, setBattle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myTurn, setMyTurn] = useState(false);
  const [result, setResult] = useState(null); // 'win' | 'lose' | null
  const navigate = useNavigate(); // ✅ inisialisasi navigator

  const readC = useMemo(() => provider && getReadContract(provider), [provider]);
  const writeC = useMemo(() => signer && getWriteContract(signer), [signer]);

  const fetchBattle = async () => {
    if (!readC) return;
    const b = await readC.getBattle(battleId);
    setBattle(b);
    // Determine myTurn
    if (address && b) {
      const amP1 = b.player1?.toLowerCase() === address.toLowerCase();
      setMyTurn(Boolean(amP1 ? b.isPlayer1Turn : !b.isPlayer1Turn));
    }
    setLoading(false);
  };

  const takeAction = async (action) => {
    const tx = await writeC.takeAction(action);
    await tx.wait();
    fetchBattle();
  };

  useEffect(() => {
    fetchBattle();
    const t = setInterval(fetchBattle, 5000);
    return () => clearInterval(t);
  }, [readC, battleId, address]);

  useEffect(() => {
    if (!writeC) return;
    const onAction = (id) => {
      if (Number(id) === Number(battleId)) fetchBattle();
    };
    const onEnd = (id, winner, loser) => {
      if (Number(id) !== Number(battleId)) return;
      if (winner?.toLowerCase() === address?.toLowerCase()) setResult('win');
      else setResult('lose');
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
  }, [writeC, battleId, address]);

  if (loading || !battle) return <div className="card">Loading battle #{battleId}…</div>;

  const amP1 = battle.player1?.toLowerCase() === address?.toLowerCase();
  const myHP = amP1 ? battle.player1HP : battle.player2HP;
  const oppHP = amP1 ? battle.player2HP : battle.player1HP;

  return (
    <div className="card flex flex-col gap-5">
      <h2 className="text-xl font-bold">Battle #{String(battleId)}</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="mb-2 text-sm text-slate-300">You ({amP1 ? 'P1' : 'P2'})</div>
          <HealthBar label={`You`} current={myHP} max={100} />
        </div>
        <div>
          <div className="mb-2 text-sm text-slate-300">Opponent ({amP1 ? 'P2' : 'P1'})</div>
          <HealthBar label={`Opponent`} current={oppHP} max={100} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700">
          Turn: {battle.isPlayer1Turn ? 'P1' : 'P2'}
        </span>
        {result && (
          <span
            className={`px-3 py-1 rounded-xl ${
              result === 'win' ? 'bg-emerald-700' : 'bg-rose-700'
            }`}
          >
            {result === 'win' ? 'You Win!' : 'You Lose'}
          </span>
        )}
      </div>

      <ActionButtons
        disabled={!myTurn || result !== null || !battle.isActive}
        onAction={takeAction}
      />

      {!battle.isActive && (
        <div className="flex flex-col items-center gap-3">
          <div className="text-slate-300 text-sm">Battle finished.</div>
          <button
            onClick={() => navigate('/lobby')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow"
          >
            ⬅️ Kembali ke Lobby
          </button>
        </div>
      )}
    </div>
  );
}
