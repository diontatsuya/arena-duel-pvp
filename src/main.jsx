import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { PrivyProvider } from "@privy-io/react-auth";

// Konfigurasi custom chain untuk Somnia Testnet
const somniaChain = {
  id: 0xc474, // ← Ganti sesuai chainId Somnia Testnet kamu
  name: "Somnia Testnet",
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.somnia.network"], // ← Ganti jika pakai RPC lain
    },
  },
  nativeCurrency: {
    name: "Somnia Test Token",
    symbol: "STT",
    decimals: 18,
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PrivyProvider
      appId="cmcn6y46j00mnl40m3u5bee9v"
      config={{
        loginMethods: ["wallet"],
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        supportedChains: [somniaChain], // ← penting agar OKX Wallet tahu konek ke mana
        appearance: {
          theme: "dark",
        },
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
);
