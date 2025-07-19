// src/utils/connectWallet.js
import { ethers } from "ethers";

const SOMNIA_CHAIN_ID = "0xc488"; // 50312 desimal

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

export async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask belum terpasang!");
    return null;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { chainId } = await provider.getNetwork();

  if (chainId !== parseInt(SOMNIA_CHAIN_ID, 16)) {
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
          return null;
        }
      } else {
        console.error("Gagal pindah jaringan:", switchError);
        return null;
      }
    }
  }

  const accounts = await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  return {
    provider,
    signer,
    account: accounts[0],
  };
}
