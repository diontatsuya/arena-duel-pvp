import { useWallet } from '../context/WalletContext.jsx';
import { CHAIN_ID } from '../utils/constants.js';

export default function ConnectWalletButton() {
  const { address, chainId, connect, disconnect, ready } = useWallet();

  if (!ready) return <button className="btn-secondary">Loading…</button>;

  if (!address) {
    return (
      <button onClick={connect} className="btn-primary">Connect Wallet</button>
    );
  }

  const wrongNet = chainId && chainId !== CHAIN_ID;

  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs px-2 py-1 rounded-full ${wrongNet ? 'bg-red-600' : 'bg-emerald-700'}`}>
        {wrongNet ? `Wrong Chain (id=${chainId})` : 'Connected'}
      </span>
      <span className="text-sm font-mono hidden sm:block">{address.slice(0,6)}…{address.slice(-4)}</span>
      <button onClick={disconnect} className="btn-secondary">Disconnect</button>
    </div>
  );
}
