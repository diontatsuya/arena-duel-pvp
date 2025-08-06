import { ethers } from "ethers";

const SOMNIA_CHAIN_ID = "0xc488"; // 50312 hex
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
  const ethereum = window.ethereum || window.mises || window.okxwallet;

  if (!ethereum) {
    alert("Wallet tidak ditemukan. Gunakan browser DApp atau MetaMask.");
    return null;
  }

  const provider = new ethers.BrowserProvider(ethereum);

  let network;
  try {
    network = await provider.getNetwork();
  } catch (err) {
    console.error("Gagal mendapatkan jaringan:", err);
    alert("Gagal mendeteksi jaringan wallet.");
    return null;
  }

  // Switch / add Somnia network jika perlu
  if (network.chainId !== parseInt(expectedChainIdHex, 16)) {
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: expectedChainIdHex }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [SOMNIA_PARAMS],
          });
        } catch (addError) {
          console.error("Gagal menambahkan jaringan Somnia:", addError);
          alert("Gagal menambahkan jaringan Somnia.");
          return null;
        }
      } else {
        console.error("Gagal mengganti jaringan:", switchError);
        alert("Gagal mengganti jaringan ke Somnia.");
        return null;
      }
    }
  }

  // Minta akun
  let accounts;
  try {
    accounts = await ethereum.request({ method: "eth_requestAccounts" });
  } catch (err) {
    console.error("Gagal meminta akses akun:", err);
    alert("Gagal meminta akses akun.");
    return null;
  }

  if (!accounts || accounts.length === 0) {
    alert("Tidak ada akun ditemukan.");
    return null;
  }

  const signer = await provider.getSigner();

  setupWalletListeners(ethereum);

  return {
    provider,
    signer,
    account: accounts[0],
  };
}

// Fungsi disconnect wallet
export function disconnectWallet() {
  const ethereum = window.ethereum || window.mises || window.okxwallet;
  if (ethereum) {
    ethereum.removeAllListeners("accountsChanged");
    ethereum.removeAllListeners("chainChanged");
  }

  return {
    provider: null,
    signer: null,
    account: null,
  };
}

// Listener saat akun atau jaringan berubah
function setupWalletListeners(ethereum) {
  if (!ethereum) return;

  ethereum.on("accountsChanged", () => {
    window.location.reload();
  });

  ethereum.on("chainChanged", () => {
    window.location.reload();
  });
}
