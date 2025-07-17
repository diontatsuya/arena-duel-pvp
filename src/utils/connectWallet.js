import { ethers } from "ethers";

export const connectWallet = async () => {
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask tidak ditemukan. Silakan install terlebih dahulu.");
    return null;
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    return { provider, signer, address };
  } catch (err) {
    console.error("Gagal connect wallet:", err);
    return null;
  }
};
