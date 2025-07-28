// src/pages/ArenaPVP.jsx

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [status, setStatus] = useState("Belum terhubung");
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);

  // Connect wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      const tempProvider = new ethers.BrowserProvider(window.ethereum);
      const tempSigner = await tempProvider.getSigner();
      const tempContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, tempSigner);
      const address = await tempSigner.getAddress();

      setProvider(tempProvider);
      setSigner(tempSigner);
      setContract(tempContract);
      setCurrentAccount(address);
    } else {
      alert("MetaMask tidak ditemukan!");
    }
  };

  const fetchGameState = async () => {
    if (!contract || !currentAccount) return;

    try {
      const playerData = await contract.players(currentAccount);
      const opponentAddress = playerData.opponent;
      const opponentData = opponentAddress !== ethers.ZeroAddress
        ? await contract.players(opponentAddress)
        : null;

      setPlayer(playerData);
      setOpponent(opponentData);
      setIsPlayerTurn(playerData.isTurn);

      if (opponentAddress === ethers.ZeroAddress) {
        setStatus("Menunggu lawan...");
      } else {
        setStatus("Pertandingan Dimulai!");
      }
    } catch (error) {
      console.error("Gagal ambil data pemain:", error);
    }
  };

  const joinMatch = async () => {
    if (!contract) return;
    try {
      const tx = await contract.joinMatch();
      await tx.wait();
      fetchGameState();
    } catch (error) {
      console.error("Gagal join:", error);
    }
  };

  const takeAction = async (actionId) => {
    if (!contract || !isPlayerTurn) return;

    try {
      const tx = await contract.takeTurn(actionId);
      await tx.wait();
      fetchGameState();
    } catch (error) {
      console.error("Gagal ambil aksi:", error);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  useEffect(() => {
    if (contract && currentAccount) {
      fetchGameState();
    }
  }, [contract, currentAccount]);

  return (
    <div className="text-center p-4">
      <h2 className="text-2xl font-bold mb-2">Arena PvP</h2>
      <p className="mb-4">Status: {status}</p>

      {currentAccount && (
        <div className="mb-4 text-sm text-gray-400">Wallet: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}</div>
      )}

      {!currentAccount && (
        <button
          onClick={connectWallet}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          Hubungkan Wallet
        </button>
      )}

      {currentAccount && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold">Kamu</h3>
              <p>HP: {player?.hp ?? "?"}</p>
              <p>Aksi Terakhir: {player?.lastAction}</p>
            </div>
            <div>
              <h3 className="font-semibold">Lawan</h3>
              <p>HP: {opponent?.hp ?? "?"}</p>
              <p>Aksi Terakhir: {opponent?.lastAction}</p>
            </div>
          </div>

          {status === "Menunggu lawan..." && (
            <button
              onClick={joinMatch}
              className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600"
            >
              Gabung PvP
            </button>
          )}

          {status === "Pertandingan Dimulai!" && isPlayerTurn && (
            <div className="flex justify-center gap-4">
              <button
                onClick={() => takeAction(1)}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              >
                Serang
              </button>
              <button
                onClick={() => takeAction(2)}
                className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
              >
                Bertahan
              </button>
              <button
                onClick={() => takeAction(3)}
                className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
              >
                Heal
              </button>
            </div>
          )}

          {status === "Pertandingan Dimulai!" && !isPlayerTurn && (
            <p className="mt-4">Menunggu giliran lawan...</p>
          )}
        </>
      )}
    </div>
  );
};

export default ArenaPVP;
