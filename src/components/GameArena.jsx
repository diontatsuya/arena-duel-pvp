import React from "react";
import ArenaPVP from "./ArenaPVP";
import { BrowserProvider } from "ethers";

const GameArena = ({ provider, address, setAddress, contract, setContract }) => {
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const prov = new BrowserProvider(window.ethereum);
        const signer = await prov.getSigner();
        const addr = await signer.getAddress();
        setAddress(addr);
      } catch (err) {
        console.error("Connection error:", err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <div className="text-center space-y-6">
      {address ? (
        <>
          <p className="text-xl">Connected as: {address}</p>
          <ArenaPVP
            address={address}
            contract={contract}
            setContract={setContract}
          />
        </>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default GameArena;
