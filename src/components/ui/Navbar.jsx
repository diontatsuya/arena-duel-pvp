import { useContext } from "react";
import { Link } from "react-router-dom";
import { WalletContext } from "../../context/WalletContext";

const Navbar = () => {
  const {
    walletAddress,
    signature,
    sttBalance,
    connectWallet,
    disconnectWallet,
  } = useContext(WalletContext);

  const handleCopySignature = () => {
    if (signature) {
      navigator.clipboard.writeText(signature);
      alert("Signature disalin ke clipboard!");
    }
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="text-xl font-bold text-white">
        <Link to="/">Arena Duel</Link>
      </div>
      <div className="flex space-x-4 items-center">
        <Link to="/" className="text-white hover:underline">
          Home
        </Link>
        <Link to="/join-pvp" className="text-white hover:underline">
          Join PvP
        </Link>
        <Link to="/arena-pvp" className="text-white hover:underline">
          Arena PvP
        </Link>
        <Link to="/arena-pve" className="text-white hover:underline">
          Arena PvE
        </Link>

        {walletAddress ? (
          <div className="flex flex-col items-end space-y-1 text-right">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
              <button
                onClick={disconnectWallet}
                className="text-red-400 hover:underline"
              >
                Logout
              </button>
            </div>
            {signature && (
              <div className="text-xs text-gray-400">
                <span className="mr-2">Signed</span>
                <button
                  onClick={handleCopySignature}
                  className="text-blue-400 hover:underline"
                >
                  Copy Signature
                </button>
              </div>
            )}
            {sttBalance && (
              <div className="text-xs text-yellow-300">
                Saldo: {Number(sttBalance).toFixed(4)} STT
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white"
          >
            Hubungkan Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
