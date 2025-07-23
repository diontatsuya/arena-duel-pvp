import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [status, setStatus] = useState("Belum terhubung");

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const tempProvider = new ethers.BrowserProvider(window.ethereum);
        const tempSigner = await tempProvider.getSigner();
        const tempContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, tempSigner);

        const address = await tempSigner.getAddress();
        setProvider(tempProvider);
        setSigner(tempSigner);
        setContract(tempContract);
        setWalletAddress(address);
        setStatus("Terhubung");

        fetchPlayer(tempContract, address);
      }
    };

    init();
  }, []);

  const fetchPlayer = async (contract, address) => {
    try {
      const playerData = await contract.players(address);
      setPlayer(playerData);

      if (playerData.opponent !== ethers.ZeroAddress) {
        const opponentData = await contract.players(playerData.opponent);
        setOpponent(opponentData);
      } else {
        setOpponent(null);
      }
    } catch (error) {
      console.error("Gagal mengambil data pemain:", error);
    }
  };

  const handleJoinGame = async () => {
    if (!contract || !signer) return;
    setIsJoining(true);

    try {
      const tx = await contract.joinGame({ gasLimit: 100000 });
      setStatus("Menunggu konfirmasi...");
      await tx.wait();
      setStatus("Berhasil bergabung!");
      fetchPlayer(contract, walletAddress);
    } catch (error) {
      console.error("Gagal bergabung:", error);
      setStatus("Gagal bergabung");
    }

    setIsJoining(false);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Arena PvP</h1>
      <div className="text-center mb-2">Status: {status}</div>

      {!player?.opponent && (
        <div className="text-center mb-4">
          <button
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded disabled:opacity-50"
            onClick={handleJoinGame}
            disabled={isJoining || !signer}
          >
            {isJoining ? "Bergabung..." : "Gabung PvP"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">Kamu</h2>
          <p>{player ? walletAddress : "Belum bergabung"}</p>
          <p>HP: {player ? player.hp?.toString() : "-"}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Lawan</h2>
          <p>{opponent ? opponent.opponent : "-"}</p>
          <p>HP: {opponent ? opponent.hp?.toString() : "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default ArenaPVP;
