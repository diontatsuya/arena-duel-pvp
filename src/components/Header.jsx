import React from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";

const Header = () => {
  const { login, logout, ready, authenticated } = usePrivy();
  const { wallets } = useWallets();

  const connectedWallet = wallets.length > 0 ? wallets[0] : null;

  const truncateAddress = (address) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  };

  return (
    <header className="w-full px-4 py-3 bg-gray-900 text-white flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">Arena Duel</h1>
      {ready && (
        <div>
          {authenticated && connectedWallet ? (
            <div className="flex items-center gap-3">
              <span className="text-sm bg-gray-700 px-3 py-1 rounded">
                {truncateAddress(connectedWallet.address)}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
            >
              Connect Wallet
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
