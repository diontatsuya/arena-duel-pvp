export const checkAndSwitchNetwork = async () => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('Wallet tidak ditemukan');
  }

  const provider = window.ethereum;
  const targetChainIdDecimal = 50312;
  const targetChainIdHex = `0x${targetChainIdDecimal.toString(16)}`;

  try {
    const currentChainId = await provider.request({ method: 'eth_chainId' });

    if (currentChainId !== targetChainIdHex) {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainIdHex }],
      });
    }
  } catch (switchError) {
    // Jika jaringan belum ditambahkan ke wallet
    if (switchError.code === 4902) {
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: targetChainIdHex,
              chainName: 'Somnia Testnet',
              nativeCurrency: {
                name: 'Somnia Token',
                symbol: 'STT',
                decimals: 18,
              },
              rpcUrls: ['https://rpc.testnet.somnia.network'],
              blockExplorerUrls: ['https://explorer.testnet.somnia.network'],
            },
          ],
        });
      } catch (addError) {
        throw new Error('Gagal menambahkan jaringan Somnia ke wallet');
      }
    } else {
      throw switchError;
    }
  }
};
