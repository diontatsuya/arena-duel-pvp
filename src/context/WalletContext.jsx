import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { CHAIN_ID } from '../utils/constants.js';

const WalletContext = createContext(null);
export const useWallet = () => useContext(WalletContext);

export function WalletProvider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [ready, setReady] = useState(false);

  const hasMetaMask = typeof window !== 'undefined' && window.ethereum;

  const connect = async () => {
    if (!hasMetaMask) throw new Error('MetaMask tidak ditemukan');
    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    await browserProvider.send('eth_requestAccounts', []);
    const s = await browserProvider.getSigner();
    const network = await browserProvider.getNetwork();
    setProvider(browserProvider);
    setSigner(s);
    setAddress(await s.getAddress());
    setChainId(Number(network.chainId));
  };

  const disconnect = () => {
    setSigner(null);
    setAddress(null);
    // Provider tetap ada; MetaMask tidak punya programmatic disconnect.
  };

  // Auto-init if already connected
  useEffect(() => {
    (async () => {
      if (!hasMetaMask) { setReady(true); return; }
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);
      try {
        const accounts = await browserProvider.listAccounts();
        const network = await browserProvider.getNetwork();
        setChainId(Number(network.chainId));
        if (accounts.length) {
          const s = await browserProvider.getSigner();
          setSigner(s);
          setAddress(await s.getAddress());
        }
      } catch {}
      setReady(true);
    })();
  }, [hasMetaMask]);

  // Listeners
  useEffect(() => {
    if (!hasMetaMask) return;
    const onAccountsChanged = async (accs) => {
      if (accs.length === 0) {
        disconnect();
      } else {
        const s = await provider.getSigner();
        setSigner(s);
        setAddress(await s.getAddress());
      }
    };
    const onChainChanged = async () => {
      const net = await provider.getNetwork();
      setChainId(Number(net.chainId));
    };

    window.ethereum?.on('accountsChanged', onAccountsChanged);
    window.ethereum?.on('chainChanged', onChainChanged);
    return () => {
      window.ethereum?.removeListener('accountsChanged', onAccountsChanged);
      window.ethereum?.removeListener('chainChanged', onChainChanged);
    };
  }, [provider, hasMetaMask]);

  const value = useMemo(() => ({ provider, signer, address, chainId, ready, connect, disconnect }), [provider, signer, address, chainId, ready]);
  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}
