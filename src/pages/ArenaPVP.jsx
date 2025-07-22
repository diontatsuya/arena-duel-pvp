import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [player, setPlayer] = useState({});
  const [opponent, setOpponent] = useState({});
  const [isWaiting, setIsWaiting] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [highlight, setHighlight] = useState(""); // for animation

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const tempProvider = new ethers.BrowserProvider(window.ethereum);
        const tempSigner = await tempProvider.getSigner();
        const tempContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, tempSigner);

        setProvider(tempProvider);
        setSigner(tempSigner);
        setContract(tempContract);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!contract || !signer) return;
    const fetchStatus = async () => {
      const address = await signer.getAddress();
      const data = await contract.players(address);
      const opponentData = await contract.players(data.opponent);

      setPlayer({ address, ...data });
      setOpponent({ address: data.opponent, ...opponentData });

      setIsWaiting(data.opponent === ethers.ZeroAddress);
    };

    fetchStatus();

    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [contract, signer]);

  const handleAction = async (actionCode) => {
    if (!contract || actionInProgress || isWaiting || !player.isTurn) return;
    setActionInProgress(true);
    try {
      const tx = await contract.takeAction(actionCode);
      setFeedback("Menunggu konfirmasi aksi...");
      await tx.wait();
      setFeedback("Aksi berhasil!");
      animateAction(actionCode);
    } catch (err) {
      console.error(err);
      setFeedback("Gagal melakukan aksi.");
    }
    setActionInProgress(false);
  };

  const animateAction = (actionCode) => {
    let color = "";
    if (actionCode === 1) color = "attack";
    else if (actionCode === 2) color = "defend";
    else if (actionCode === 3) color = "heal";

    setHighlight(color);
    setTimeout(() => setHighlight(""), 400);
  };

  const renderFeedback = () => {
    if (isWaiting) return "Menunggu lawan bergabung...";
    if (!player.isTurn) return "Menunggu giliran lawan...";
    return "Giliranmu! Pilih aksi.";
  };

  return (
    <div className={`min-h-screen px-4 py-6 transition-all duration-300 ${highlight === "attack" ? "bg-red-900" : highlight === "defend" ? "bg-blue-900" : highlight === "heal" ? "bg-green-900" : "bg-gray-900"}`}>
      <h1 className="text-3xl font-bold text-center mb-6">Arena PVP</h1>
      <p className="text-center text-lg mb-4">{renderFeedback()}</p>

      <div className="grid grid-cols-2 gap-4 mb-6 text-center">
        <div>
          <h2 className="text-xl font-semibold">Kamu</h2>
          <p className="text-sm break-words">{player.address}</p>
          <p className="text-2xl mt-2">{Number(player.hp || 0)} / 100</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Lawan</h2>
          <p className="text-sm break-words">{opponent.address}</p>
          <p className="text-2xl mt-2">{Number(opponent.hp || 0)} / 100</p>
        </div>
      </div>

      {!isWaiting && player.isTurn && (
        <div className="flex justify-center gap-4">
          <button
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition disabled:opacity-50"
            onClick={() => handleAction(1)}
            disabled={actionInProgress}
          >
            Attack
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition disabled:opacity-50"
            onClick={() => handleAction(2)}
            disabled={actionInProgress}
          >
            Defend
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl transition disabled:opacity-50"
            onClick={() => handleAction(3)}
            disabled={actionInProgress}
          >
            Heal
          </button>
        </div>
      )}

      {feedback && (
        <p className="text-center text-yellow-400 mt-4">{feedback}</p>
      )}
    </div>
  );
};

export default ArenaPVP;
