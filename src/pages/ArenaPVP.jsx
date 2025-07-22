import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ArenaPVP = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [status, setStatus] = useState("Belum terhubung");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const _provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(_provider);
        const accounts = await _provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]);
        setStatus("Terhubung");

        const _signer = _provider.getSigner();
        setSigner(_signer);

        const _contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, _signer);
        setContract(_contract);
      } else {
        setStatus("MetaMask tidak ditemukan");
      }
    };

    init();
  }, []);

  const joinMatch = async () => {
    if (!contract) return;
    try {
      const tx = await contract.joinMatch();
      setStatus("Menunggu konfirmasi transaksi...");
      await tx.wait();
      setStatus("Berhasil bergabung ke PvP!");
    } catch (err) {
      console.error(err);
      setStatus("Gagal bergabung. Coba lagi.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-2">Arena PvP</h1>
      <p className="mb-2">Status: {status}</p>

      <button
        onClick={joinMatch}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
      >
        Gabung PvP
      </button>
    </div>
  );
};

export default ArenaPVP;
