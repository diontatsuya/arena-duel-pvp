import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ArenaDuelABI from "../utils/contractABI.json";

const CONTRACT_ADDRESSES = {
  50312: "0x95dd66c55214a3d603fe1657e22f710692fcbd9f" // Somnia Testnet
};

const ACTIONS = ["None", "Attack", "Defend", "Heal"];

export default function Arena() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [playerState, setPlayerState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chainId, setChainId] = useState(null);

  // Connect wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await ethProvider.send("eth_requestAccounts", []);
      const signer = ethProvider.getSigner();
      const network = await ethProvider.getNetwork();

      const chainIdHex = network.chainId;
      const contractAddress = CONTRACT_ADDRESSES[chainIdHex];

      if (!contractAddress) {
        alert(`Unsupported network with chain ID: ${chainIdHex}`);
        return;
      }

      const contractInstance = new ethers.Contract(
        contractAddress,
        ArenaDuelABI,
        signer
      );

      setProvider(ethProvider);
      setSigner(signer);
      setContract(contractInstance);
      setAccount(accounts[0]);
      setChainId(chainIdHex);
    } else {
      alert("Install MetaMask!");
    }
  };

  const joinArena = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.joinArena();
      await tx.wait();
      fetchPlayerState();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchPlayerState = async () => {
    if (!contract || !account) return;
    const state = await contract.getGameState();
    setPlayerState(state);
  };

  const performAction = async (actionIndex) => {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.performAction(actionIndex);
      await tx.wait();
      fetchPlayerState();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => window.location.reload());
      window.ethereum.on("chainChanged", () => window.location.reload());
    }
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Arena Duel PvP</h1>
      {!account ? (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <p className="mb-2 text-sm text-gray-600">Connected: {account}</p>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded mb-2"
            onClick={joinArena}
            disabled={loading}
          >
            Join Arena
          </button>
          <div className="my-4">
            {playerState ? (
              <>
                <p className="mb-2">HP: {playerState.hp?.toString()}</p>
                <p className="mb-2">
                  Opponent: {playerState.opponent !== ethers.constants.AddressZero
                    ? playerState.opponent
                    : "Waiting..."}
                </p>
                <p className="mb-2">Your Turn: {playerState.isTurn ? "Yes" : "No"}</p>
                <p className="mb-4">Last Action: {ACTIONS[playerState.lastAction]}</p>
                {playerState.isTurn && (
                  <div className="space-x-2">
                    {ACTIONS.slice(1).map((action, i) => (
                      <button
                        key={action}
                        onClick={() => performAction(i + 1)}
                        className="bg-purple-600 text-white px-3 py-1 rounded"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p>Loading game state...</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
