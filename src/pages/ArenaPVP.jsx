// src/pages/ArenaPVP.jsx
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { connectWallet } from "../utils/connectWallet";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ArenaPVP = () => {
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const handleConnectWallet = async () => {
    const connection = await connectWallet();
    if (connection) {
      setAccount(connection.account);
      setSigner(connection.signer);

      const arenaContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        connection.signer
      );
      setContract(arenaContract);
    }
  };

  useEffect(() => {
    // Coba koneksi otomatis jika sudah ada wallet sebelumnya
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        if (accounts.length > 0) {
          handleConnectWallet();
        }
      });
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      {!account ? (
        <button
          onClick={handleConnectWallet}
          className="bg-purple-600 px-6 py-3 rounded-xl hover:bg-purple-700 transition"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="text-center">
          <p className="mb-4">Connected: {account}</p>
          <p className="mb-2">Contract Ready: {contract ? "Yes" : "No"}</p>
          {/* Komponen game PvP atau PvE bisa ditambahkan di sini */}
        </div>
      )}
    </div>
  );
};

export default ArenaPVP;
