import { ethers } from "ethers";

const SOMNIA_CHAIN_ID = "0xc488"; // 50312 (hex)
const SOMNIA_PARAMS = {
  chainId: SOMNIA_CHAIN_ID,
  chainName: "Somnia Testnet",
  nativeCurrency: {
    name: "Somnia Test Token",
    symbol: "STT",
    decimals: 18,
  },
  rpcUrls: ["https://dream-rpc.somnia.network"],
  blockExplorerUrls: ["https://shannon-explorer.somnia.network"],
};

export async function connectWalletAndCheckNetwork() {
  if (!window.ethereum) {
    alert("MetaMask belum terpasang!");
    return null;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();

  if (network.chainId !== parseInt(SOMNIA_CHAIN_ID, 16)) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SOMNIA_CHAIN_ID }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [SOMNIA_PARAMS],
          });
        } catch (addError) {
          console.error("Gagal menambahkan jaringan Somnia:", addError);
          alert("Gagal menambahkan jaringan Somnia.");
          return null;
        }
      } else {
        console.error("Gagal pindah jaringan:", switchError);
        alert("Gagal mengganti jaringan ke Somnia.");
        return null;
      }
    }
  }

  let accounts;
  try {
    accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  } catch (err) {
    console.error("Gagal meminta akses akun:", err);
    alert("Gagal meminta akses akun.");
    return null;
  }

  const signer = await provider.getSigner();
  return {
    provider,
    signer,
    account: accounts[0],
  };
}
