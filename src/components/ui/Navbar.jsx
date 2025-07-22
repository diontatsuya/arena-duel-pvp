const connectWallet = async () => {
  try {
    let ethereum = window.ethereum;

    // Fallback untuk OKX Wallet jika tidak tersedia
    if (!ethereum && window.okxwallet) {
      ethereum = window.okxwallet;
    }

    if (!ethereum) {
      alert("Wallet tidak ditemukan. Gunakan browser yang mendukung Ethereum seperti MetaMask atau OKX.");
      return;
    }

    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    setProvider(provider);
    setSigner(signer);
    setWalletAddress(address);
    setIsConnected(true);
  } catch (err) {
    console.error("Gagal menghubungkan wallet:", err);
    alert("Gagal menghubungkan wallet.");
  }
};

export default Navbar;
