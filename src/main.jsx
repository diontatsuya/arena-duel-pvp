import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { WagmiProvider, createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';

// ✅ Definisi jaringan Somnia Testnet
const somniaChain = {
  id: 50312, // ✅ chainId decimal (0xc474 in hex)
  name: 'Somnia Testnet',
  nativeCurrency: {
    name: 'Somnia Test Token',
    symbol: 'STT',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.somnia.network'],
    },
  },
};

const { chains, publicClient } = configureChains([somniaChain], [publicProvider()]);

// ✅ Konfigurasi WAGMI + ConnectKit
const config = createConfig(
  getDefaultConfig({
    appName: 'Arena Duel',
    chains,
    publicClient,
  })
);

// ✅ Render ke DOM
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <ConnectKitProvider>
        <App />
      </ConnectKitProvider>
    </WagmiProvider>
  </React.StrictMode>
);
