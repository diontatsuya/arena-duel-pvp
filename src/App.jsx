// src/App.jsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ConnectWallet from "./components/ConnectWallet";
import GameArena from "./components/GameArena";
import ArenaPVP from "./components/ArenaPVP";
import ArenaPVE from "./components/ArenaPVE";

function App() {
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ConnectWallet
              setSigner={setSigner}
              setWalletAddress={setWalletAddress}
            />
          }
        />
        <Route path="/arena" element={<GameArena signer={signer} walletAddress={walletAddress} />} />
        <Route path="/arena-pvp" element={<ArenaPVP signer={signer} walletAddress={walletAddress} />} />
        <Route path="/arena-pve" element={<ArenaPVE signer={signer} walletAddress={walletAddress} />} />
      </Routes>
    </Router>
  );
}

export default App;
