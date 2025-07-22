import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [status, setStatus] = useState("Belum terhubung");

  const actionLabel = (actionCode) => {
    switch (actionCode) {
      case 1: return "Attack";
      case 2: return "Defend";
      case 3: return "Heal";
      default: return "None";
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      const prov = new ethers.providers.Web3Provider(window.ethereum);
      await prov.send("eth_requestAccounts", []);
      const sign = prov.getSigner();
      const addr = await sign.getAddress();
      const cont = new ethers.Contract(CONTRACT_ADDRESS, contractABI, sign);

      setProvider(prov);
      setSigner(sign);
      setContract(cont);
      fetchPlayers(cont, addr);
    } else {
      setStatus("Wallet tidak ditemukan.");
    }
  };

  const fetchPlayers = async (contract, addr) => {
    const data = await contract.players(addr);
    setPlayer(data);

    if (data.opponent !== ethers.constants.AddressZero) {
      const opp = await contract.players(data.opponent);
      setOpponent(opp);
      setStatus("Match ditemukan!");
    } else if (data.hp > 0) {
      setStatus("Menunggu lawan...");
    } else {
      setStatus("Gabung PvP untuk mulai");
    }
  };

  const joinMatchmaking = async () => {
    if (contract) {
      const tx = await contract.matchPlayer();
      await tx.wait();
      const addr = await signer.getAddress();
      fetchPlayers(contract, addr);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-4">Arena PvP</h1>

      <button
        onClick={connectWallet}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mb-4"
      >
        Hubungkan Wallet
      </button>

      <div className="mb-4">Status: {status}</div>

      <button
        onClick={joinMatchmaking}
        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded mb-4"
        disabled={!contract}
      >
        Gabung PvP
      </button>

      <div className="grid grid-cols-2 gap-4 mt-6 bg-gray-800 p-4 rounded-xl">
        <div>
          <h2 className="text-lg font-semibold mb-2">Kamu</h2>
          <p>{player ? `${player.hp} / 100` : "?"}</p>
          <p>Aksi: {player ? actionLabel(player.lastAction) : "-"}</p>
          <p>{player?.isTurn ? "🎯 Giliranmu" : ""}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Lawan</h2>
          <p>{opponent ? `${opponent.hp} / 100` : "?"}</p>
          <p>Aksi: {opponent ? actionLabel(opponent.lastAction) : "-"}</p>
          <p>{opponent?.isTurn ? "🎯 Giliran lawan" : ""}</p>
        </div>
      </div>
    </div>
  );
};

export default ArenaPVP;
