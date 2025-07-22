// src/components/ui/WalletStatus.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const WalletStatus = ({ isLoggedIn, account, sttBalance, onConnect, onLogout }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md text-center">
      {account ? (
        isLoggedIn ? (
          <>
            <p className="mb-2 text-green-400 font-semibold">
              Logged in as {account.slice(0, 6)}...{account.slice(-4)}
            </p>
            <p className="mb-2 text-yellow-400">
              STT Balance: {sttBalance ?? "..."} STT
            </p>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={onConnect}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Login with Wallet
          </button>
        )
      ) : (
        <button
          onClick={onConnect}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletStatus;
