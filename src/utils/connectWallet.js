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

// Fungsi koneksi wallet
export async function connectWallet(expectedChainIdHex = SOMNIA_CHAIN_ID) {
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask belum terpasang!");
    return null;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();

  if (network.chainId !== parseInt(expectedChainIdHex, 16)) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: expectedChainIdHex }],
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

  if (!accounts || accounts.length === 0) {
    alert("Tidak ada akun ditemukan di MetaMask.");
    return null;
  }

  const signer = await provider.getSigner();

  // Tambahkan listener opsional
  setupWalletListeners();

  return {
    provider,
    signer,
    account: accounts[0],
  };
}

// Fungsi disconnect wallet
export function disconnectWallet() {
  if (typeof window.ethereum !== "undefined") {
    window.ethereum.removeAllListeners("accountsChanged");
    window.ethereum.removeAllListeners("chainChanged");
  }

  return {
    provider: null,
    signer: null,
    account: null,
  };
}

// Fungsi opsional: listener saat akun atau jaringan berubah
function setupWalletListeners() {
  if (typeof window.ethereum !== "undefined") {
    window.ethereum.on("accountsChanged", () => {
      window.location.reload(); // atau update state di context
    });

    window.ethereum.on("chainChanged", () => {
      window.location.reload(); // atau update state di context
    });
  }
}
