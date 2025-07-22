import { useEffect, useState } from "react";
import { ethers } from "ethers";
import HealthBar from "../components/ui/HealthBar";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [playerAddress, setPlayerAddress] = useState("");
  const [playerHP, setPlayerHP] = useState(0);
  const [opponentHP, setOpponentHP] = useState(0);
  const [opponentAddress, setOpponentAddress] = useState("");
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== "undefined") {
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const newSigner = await newProvider.getSigner();
        const userAddress = await newSigner.getAddress();
        const newContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, newSigner);

        setProvider(newProvider);
        setSigner(newSigner);
        setContract(newContract);
        setPlayerAddress(userAddress);

        const playerData = await newContract.players(userAddress);

        if (playerData.opponent === ethers.ZeroAddress) {
          setStatus("Menunggu lawan bergabung...");
        } else {
          setOpponentAddress(playerData.opponent);
          setIsPlayerTurn(playerData.isTurn);
          setStatus("Lawan ditemukan!");
          await updateHPs(newContract, userAddress, playerData.opponent);
        }

        // Listen to Match event
        newContract.on("Matched", async (p1, p2) => {
          if (userAddress === p1 || userAddress === p2) {
            const updatedData = await newContract.players(userAddress);
            setOpponentAddress(updatedData.opponent);
            setIsPlayerTurn(updatedData.isTurn);
            setStatus("Lawan ditemukan!");
            await updateHPs(newContract, userAddress, updatedData.opponent);
          }
        });

        // Listen to TurnChanged event
        newContract.on("TurnChanged", (currentPlayer) => {
          setIsPlayerTurn(currentPlayer === userAddress);
        });

        // Listen to HP updates
        newContract.on("ActionPerformed", async (attacker, defender, action) => {
          if (
            attacker === userAddress ||
            defender === userAddress
          ) {
            await updateHPs(newContract, userAddress, opponentAddress);
          }
        });
      }
    };

    init();
  }, []);

  const updateHPs = async (contract, playerAddr, opponentAddr) => {
    const player = await contract.players(playerAddr);
    const opponent = await contract.players(opponentAddr);
    setPlayerHP(player.hp);
    setOpponentHP(opponent.hp);
  };

  const handleAction = async (actionCode) => {
    if (!contract) return;
    try {
      const tx = await contract.performAction(actionCode);
      setStatus("Menjalankan aksi...");
      await tx.wait();
      setStatus("Aksi selesai!");
    } catch (err) {
      console.error(err);
      setStatus("Aksi gagal!");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-4">Arena PVP</h1>
      <p className="mb-4">{status}</p>

      {opponentAddress && (
        <>
          <HealthBar name="Kamu" hp={playerHP} />
          <HealthBar name="Lawan" hp={opponentHP} />
          <p className="mb-4">
            {isPlayerTurn ? "Giliranmu!" : "Menunggu giliran lawan..."}
          </p>

          {isPlayerTurn && (
            <div className="flex gap-4">
              <button
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                onClick={() => handleAction(1)}
              >
                Attack
              </button>
              <button
                className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => handleAction(2)}
              >
                Defend
              </button>
              <button
                className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
                onClick={() => handleAction(3)}
              >
                Heal
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ArenaPVP;
