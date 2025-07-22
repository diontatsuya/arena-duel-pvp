import { useEffect, useState } from "react";
import { ethers } from "ethers";

const WalletStatus = ({ signer, provider }) => {
  const [address, setAddress] = useState(null);
  const [nativeBalance, setNativeBalance] = useState(null);

  useEffect(() => {
    const fetchAddressAndBalance = async () => {
      if (signer && provider) {
        try {
          const userAddress = await signer.getAddress();
          const balance = await provider.getBalance(userAddress);
          setAddress(userAddress);
          setNativeBalance(ethers.utils.formatEther(balance));
        } catch (err) {
          console.error("Gagal mengambil saldo STT:", err);
        }
      }
    };
    fetchAddressAndBalance();
  }, [signer, provider]);

  if (!signer) {
    return (
      <p className="text-sm text-red-400 animate-pulse">
        Wallet belum terkoneksi
      </p>
    );
  }

  return (
    <div className="text-sm text-green-400">
      <p className="break-all">Wallet: {address}</p>
      {nativeBalance && (
        <p>STT Balance: {parseFloat(nativeBalance).toFixed(4)} STT</p>
      )}
    </div>
  );
};

export default WalletStatus;
