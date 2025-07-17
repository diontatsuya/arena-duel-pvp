import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "./utils/contractABI.json";
import { CONTRACT_ADDRESS } from "./utils/contractAddress";
import ConnectWallet from "./components/ConnectWallet";

function App() {
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [hp, setHp] = useState(0);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [status, setStatus] = useState("Waiting for your turn or opponent...");

  const contract = signer
    ? new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer)
    : null;

  const getStatus = async () => {
    if (!contract || !walletAddress) return;
    const status = await contract.getStatus(walletAddress);
    setHp(parseInt(status.hp));
    setIsMyTurn(status.isTurn);
  };

  const sendAction = async (actionCode) => {
    if (!contract) return;
    const tx = await contract.playTurn(actionCode);
    setStatus("Waiting for transaction confirmation...");
    await tx.wait();
    await getStatus();
    setStatus("Action performed!");
  };

  const handleAttack = () => sendAction(1);
  const handleDefend = () => sendAction(2);
  const handleHeal = () => sendAction(3);

  useEffect(() => {
    if (signer) {
      getStatus();
      const interval = setInterval(getStatus, 5000); // poll status setiap 5 detik
      return () => clearInterval(interval);
    }
  }, [signer]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6">Arena Duel Turn-Based Game</h1>

      <ConnectWallet setSigner={setSigner} setWalletAddress={setWalletAddress} />

      {signer && (
        <>
          <h2 className="text-xl mb-2">Arena Duel PvP</h2>
          <p className="mb-4">Your Status</p>
          <p className="mb-4">HP: {hp}</p>

          <div className="flex gap-2 mb-4">
            <button
              onClick={handleAttack}
              disabled={!isMyTurn}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              Attack
            </button>
            <button
              onClick={handleDefend}
              disabled={!isMyTurn}
              className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
            >
              Defend
            </button>
            <button
              onClick={handleHeal}
              disabled={!isMyTurn}
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Heal
            </button>
          </div>

          <p className="italic text-sm">{status}</p>
        </>
      )}
    </div>
  );
}

export default App;
