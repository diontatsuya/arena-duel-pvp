import React from 'react';
import { usePrivy } from '@privy-io/react-auth';

const Navbar = () => {
  const { ready, authenticated, login, logout, user } = usePrivy();

  if (!ready) return null; // Jangan render sebelum Privy siap

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
      <div className="text-xl font-bold">Arena Duel</div>
      <div>
        {authenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-sm truncate max-w-[120px]">
              {user?.wallet?.address.slice(0, 6)}...{user?.wallet?.address.slice(-4)}
            </span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
