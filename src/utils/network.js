export const checkAndSwitchNetwork = async () => {
  const somniaChainId = '0xc478'; // Chain ID testnet Somnia

  if (window.ethereum.networkVersion !== somniaChainId) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: somniaChainId }],
      });
    } catch (switchError) {
      alert('Silakan switch ke jaringan Somnia Testnet secara manual di MetaMask.');
    }
  }
};
