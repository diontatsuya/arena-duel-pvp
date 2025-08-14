import { Link, useLocation } from 'react-router-dom';
import ConnectWalletButton from './components/ConnectWalletButton.jsx';

export default function App({ children }) {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 backdrop-blur bg-slate-950/70 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-extrabold tracking-wide">Arena Somnia</Link>
          <nav className="flex gap-3 text-sm">
            <Link className={`px-3 py-1 rounded-xl ${pathname==='/' ? 'bg-slate-800' : 'hover:bg-slate-800/60'}`} to="/">Home</Link>
            <Link className={`px-3 py-1 rounded-xl ${pathname==='/arena-battle' ? 'bg-slate-800' : 'hover:bg-slate-800/60'}`} to="/arena-battle">Arena Battle</Link>
          </nav>
          <ConnectWalletButton />
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="max-w-5xl mx-auto px-4 py-8 text-sm text-slate-400">
        Built with ❤ for Somnia testnet
      </footer>
    </div>
  );
}
