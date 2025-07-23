import { useEffect, useState } from "react";

const JoinPVP = ({ contract, signer }) => {
  const [status, setStatus] = useState("idle");
  const [account, setAccount] = useState("");

  useEffect(() => {
    const fetchAccount = async () => {
      const address = await signer.getAddress();
      setAccount(address);
    };
    fetchAccount();
  }, [signer]);

  const handleJoin = async () => {
    try {
      setStatus("joining...");
      const tx = await contract.joinQueue();
      await tx.wait();
      setStatus("berhasil");
    } catch (err) {
      console.error(err);
      setStatus("gagal");
    }
  };

  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl mb-4 font-bold">Gabung ke Arena PvP</h2>
      <p className="mb-4 text-sm text-gray-300">Wallet: {account}</p>
      <button
        onClick={handleJoin}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-bold"
      >
        Gabung PvP
      </button>
      <p className="mt-4">Status: {status}</p>
    </div>
  );
};

export default JoinPVP;
