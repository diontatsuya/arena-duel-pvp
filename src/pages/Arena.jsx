import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ArenaDuelABI from "@/utils/contractABI.json";

const contractAddress = "0x95dd66c55214a3d603fe1657e22f710692fcbd9f";

const Arena = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [status, setStatus] = useState("");
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        const tempSigner = tempProvider.getSigner();
        const accounts = await tempProvider.send("eth_requestAccounts", []);
        const address = accounts[0];

        const { chainId } = await tempProvider.getNetwork();
        if (chainId !== 50312) {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0xc4f8" }], // 50312 in hex
            });
            window.location.reload();
            return;
          } catch (switchError) {
            setIsCorrectNetwork(false);
            setStatus("Please switch to Somnia Testnet (Chain ID: 50312)");
            return;
          }
        }

        const tempContract = new ethers.Contract(
          contractAddress,
          ArenaDuelABI,
          tempSigner
        );

        setProvider(tempProvider);
        setSigner(tempSigner);
        setContract(tempContract);
        setCurrentAccount(address);
        setIsCorrectNetwork(true);
      } catch (error) {
        console.error(error);
        setStatus("Error connecting wallet");
      }
    } else {
      setStatus("Please install MetaMask");
    }
  };

  const joinArena = async () => {
    if (!contract) return;

    setLoading(true);
    setStatus("Joining arena...");
    try {
      const tx = await contract.joinArena();
      await tx.wait();
      setStatus("Successfully joined the arena!");
    } catch (error) {
      console.error(error);
      setStatus("Failed to join the arena");
    }
    setLoading(false);
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">⚔️ Arena Duel</h1>

      {isCorrectNetwork ? (
        <>
          <button
            onClick={joinArena}
            disabled={loading}
            className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-6 rounded mb-4 disabled:opacity-50"
          >
            {loading ? "Joining..." : "Join Arena"}
          </button>
        </>
      ) : (
        <p className="text-red-400 text-center mb-4">{status}</p>
      )}

      {currentAccount && (
        <p className="text-sm text-gray-300">
          Connected: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
        </p>
      )}
      {status && <p className="mt-4">{status}</p>}
    </div>
  );
};

export default Arena;
