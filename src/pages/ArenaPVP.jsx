import { useEffect, useState } from "react";
import { ethers } from "ethers";
import HealthBar from "../components/ui/HealthBar";
import ActionButtons from "../components/ui/ActionButton";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [isTurn, setIsTurn] = useState(false);
  const [status, setStatus] = useState("Menunggu lawan bergabung...");

  // Setup ethers
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        const _signer = await _provider.getSigner();
        const _contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, _signer);

        setProvider(_provider);
        setSigner(_signer);
        setContract(_contract);

        const address = await _signer.getAddress();
        const playerData = await _contract.players(address);

        // Jika sudah punya lawan
        if (playerData.opponent !== ethers.ZeroAddress) {
          const opponentData = await _contract.players(playerData.opponent);
          setPlayer({ ...playerData, address });
          setOpponent({ ...opponentData, address: playerData.opponent });
          setIsTurn(playerData.isTurn);
          setStatus("Pertarungan dimulai!");
        } else {
          setPlayer({ ...playerData, address });
          setStatus("Menunggu lawan bergabung...");
        }

        // Event listener
        _contract.on("Matched", (p1, p2) => {
          if (p1 === address || p2 === address) {
            window.location.reload(); // refresh agar data player & lawan terbaru
          }
        });

        _contract.on("ActionTaken", async (playerAddr) => {
          if (playerAddr === address || playerAddr === playerData.opponent) {
            const updatedPlayer = await _contract.players(address);
            const updatedOpponent = await _contract.players(playerData.opponent);

            setPlayer({ ...updatedPlayer, address });
            setOpponent({ ...updatedOpponent, address: playerData.opponent });
            setIsTurn(updatedPlayer.isTurn);

            // Update status
            if (updatedPlayer.hp === 0) {
              setStatus("Kamu kalah!");
            } else if (updatedOpponent.hp === 0) {
              setStatus("Kamu menang!");
            } else if (updatedPlayer.isTurn) {
              setStatus("Giliran kamu!");
            } else {
              setStatus("Menunggu giliran lawan...");
            }
          }
        });
      }
    };

    init();
  }, []);

  const handleAction = async (actionIndex) => {
    if (!contract || !isTurn) return;

    try {
      const tx = await contract.takeAction(actionIndex);
      setStatus("Menunggu konfirmasi transaksi...");
      await tx.wait();
      setStatus("Aksi dikirim. Menunggu lawan...");
    } catch (err) {
      console.error("Gagal mengirim aksi:", err);
      setStatus("Gagal mengirim aksi.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Arena PVP</h1>
      <p className="mb-4">{status}</p>

      <div className="grid grid-cols-2 gap-10 mb-6 w-full max-w-xl">
        <div>
          <h2 className="font-semibold mb-1">Kamu</h2>
          <HealthBar currentHP={Number(player?.hp || 0)} maxHP={100} />
        </div>
        <div>
          <h2 className="font-semibold mb-1">Lawan</h2>
          <HealthBar currentHP={Number(opponent?.hp || 0)} maxHP={100} />
        </div>
      </div>

      {isTurn && player?.hp > 0 && opponent?.hp > 0 && (
        <ActionButtons onAction={handleAction} />
      )}
    </div>
  );
};

export default ArenaPVP;
