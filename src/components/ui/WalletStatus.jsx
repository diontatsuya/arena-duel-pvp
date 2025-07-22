import { useEffect, useState } from "react";
import { ethers } from "ethers";

const WalletStatus = ({ signer, provider }) => {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!signer || !provider) return;

      try {
        const addr = await signer.getAddress();
        const bal = await provider.getBalance(addr);
        setAddress(addr);
        setBalance(ethers.formatEther(bal));
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    };

    fetchData();
  }, [signer, provider]);

  return (
    <div className="mt-6 p-4 bg-gray-800 rounded-xl w-full max-w-md text-center">
      <p className="mb-2"><strong>Wallet Address:</strong> {address}</p>
      <p><strong>STT Balance:</strong> {balance ? `${balance} STT` : "Loading..."}</p>
    </div>
  );
};

export default WalletStatus;
