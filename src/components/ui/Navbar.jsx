// src/components/ui/Navbar.jsx
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ActionButtons } from "./ActionButtons";
import { Wallet } from "lucide-react";

const Navbar = () => {
  const [account, setAccount] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
    } else {
      alert("MetaMask not detected");
    }
  };

  const shortAddress = (addr) =>
    addr.slice(0, 6) + "..." + addr.slice(-4);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    };
    checkConnection();
  }, []);

  return (
    <nav className="w-full bg-gray-900 text-white px-4 py-3 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">Arena Duel</h1>
      <Button onClick={connectWallet} className="gap-2">
        <Wallet size={18} />
        {account ? shortAddress(account) : "Connect Wallet"}
      </Button>
    </nav>
  );
};

export default Navbar;
