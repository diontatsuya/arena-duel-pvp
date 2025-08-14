import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="grid gap-6">
      <div className="card">
        <h1 className="text-2xl font-bold mb-2">Arena Duel – Turn Based</h1>
        <p className="text-slate-300">Duel PvP sederhana berbasis smart contract. Login wallet → join matchmaking → battle!</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold mb-2">Mulai Bermain</h2>
        <Link to="/arena-battle" className="btn-primary inline-block">Go to Arena</Link>
      </div>
    </div>
  );
}
