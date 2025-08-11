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

  const provider = new ethers.providers.Web3Provider(ethereum);

  // Pastikan di jaringan Somnia
  let network;
  try {
    network = await provider.getNetwork();
    if (network.chainId !== parseInt(expectedChainIdHex, 16)) {
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: expectedChainIdHex }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [SOMNIA_PARAMS],
          });
        } else {
          throw switchError;
        }
      }
    }
  } catch (err) {
    console.error("Gagal atur jaringan:", err);
    alert("Gagal mengatur jaringan Somnia.");
    return null;
  }

  // Minta akun
  let accounts;
  try {
    accounts = await ethereum.request({ method: "eth_requestAccounts" });
  } catch (err) {
    console.error("Gagal meminta akun:", err);
    alert("Gagal meminta akses akun.");
    return null;
  }

  if (!accounts || accounts.length === 0) {
    alert("Tidak ada akun ditemukan.");
    return null;
  }

  const signer = provider.getSigner();
  const walletAddress = await signer.getAddress();

  // Opsional: tanda tangan autentikasi
  let signature;
  try {
    signature = await signer.signMessage("Sign in to Somnia");
  } catch (err) {
    console.warn("Tanda tangan dibatalkan:", err);
    alert("Tanda tangan dibatalkan.");
    return null;
  }

  setupWalletListeners(ethereum);

  return {
    provider,
    signer,
    account: walletAddress,
    signature,
  };
}

// Fungsi untuk mendapatkan saldo native token (STT)
export async function getNativeBalance(address) {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum || window.mises || window.okxwallet);
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  } catch (err) {
    console.error("Gagal ambil saldo STT:", err);
    return "0";
  }
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
    signature: null,
  };
}

// Listener perubahan akun/jaringan
function setupWalletListeners(ethereum) {
  if (!ethereum) return;

  ethereum.on("accountsChanged", () => window.location.reload());
  ethereum.on("chainChanged", () => window.location.reload());
}
