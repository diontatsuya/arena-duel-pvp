import { ethers } from "ethers";

export async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask tidak terdeteksi");
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    return { provider, signer, address: accounts[0] };
  } catch (err) {
    console.error("Wallet connect error:", err);
    return null;
  }
}
