import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useWallet } from "../context/WalletContext";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";

const JoinPVP = () => {
  const navigate = useNavigate();
  const { walletAddress, signer } = useWallet();
  const [isWaiting, setIsWaiting] = useState(false);
  const [battleId, setBattleId] = useState("0");

  // Fungsi untuk join matchmaking di kontrak
  const joinMatchmaking = async () => {
    if (!signer) {
      alert("Wallet belum terkoneksi.");
      return null;
    }
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.joinMatchmaking();
      await tx.wait();

      // Polling untuk cek battleId aktif
      const address = await signer.getAddress();
      let id = "0";
      let retries = 0;
      while (id === "0" && retries < 10) {
        id = (await contract.activeBattleId(address)).toString();
        if (id !== "0") break;
        await new Promise((r) => setTimeout(r, 1000));
        retries++;
      }

      if (id === "0") {
        alert("Belum ada lawan, silakan tunggu...");
        return null;
      }

      return id;
    } catch (error) {
      console.error("Gagal join matchmaking:", error);
      alert("Gagal join matchmaking");
      return null;
    }
  };

  // Cek status battle aktif dan matchmaking
  useEffect(() => {
    if (!walletAddress || !signer) return;

    const checkStatus = async () => {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      try {
        const id = (await contract.activeBattleId(walletAddress)).toString();
        if (id !== "0") {
          setBattleId(id);
          navigate("/arena-battle");
          return;
        }

        // Cek apakah sedang dalam matchmaking (waiting player)
        const waitingPlayer = await contract.waitingPlayer();
        if (waitingPlayer.toLowerCase() === walletAddress.toLowerCase()) {
          setIsWaiting(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkStatus();
  }, [walletAddress, signer, navigate]);

  // Polling cek match saat menunggu
  useEffect(() => {
    if (!isWaiting) return;
    const interval = setInterval(async () => {
      if (!walletAddress || !signer) return;

      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const id = (await contract.activeBattleId(walletAddress)).toString();

      if (id !== "0") {
        setBattleId(id);
        setIsWaiting(false);
        navigate("/arena-battle");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isWaiting, walletAddress, signer, navigate]);

  const handleJoin = async () => {
    if (!walletAddress || !signer) {
      alert("Wallet belum terkoneksi.");
      return;
    }

    if (battleId !== "0") {
      navigate("/arena-battle");
      return;
    }

    const id = await joinMatchmaking();
    if (id) {
      setBattleId(id);
      setIsWaiting(true);
    }
  };

  const handleLeaveMatchmaking = async () => {
    if (!signer) return;
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.leaveMatchmaking();
      await tx.wait();
      setIsWaiting(false);
      setBattleId("0");
      alert("Berhasil keluar dari matchmaking");
    } catch (error) {
      console.error(error);
      alert("Gagal keluar matchmaking");
    }
  };

  if (isWaiting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
        <h2 className="text-2xl font-bold mb-4">Menunggu lawan ditemukan...</h2>
        <button
          onClick={handleLeaveMatchmaking}
          className="bg-red-600 hover:bg-red-700 py-2 px-6 rounded"
        >
          Batal Matchmaking
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <h1 className="text-3xl font-bold mb-6">Join PVP</h1>
      <button
        onClick={handleJoin}
        className="bg-green-600 hover:bg-green-700 py-2 px-6 rounded font-bold"
      >
        Cari Lawan
      </button>
    </div>
  );
};

export default JoinPVP;
