// src/App.jsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import ConnectWallet from "./components/ConnectWallet";
import GameArena from "./components/GameArena";
import ArenaPVP from "./components/ArenaPVP";
import ArenaPVE from "./components/ArenaPVE";

function App() {
  const [walletConnected, setWalletConnected] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ConnectWallet setWalletConnected={setWalletConnected} />
          }
        />
        <Route path="/arena" element={<GameArena />} />
        <Route path="/arena-pvp" element={<ArenaPVP />} />
        <Route path="/arena-pve" element={<ArenaPVE />} />
      </Routes>
    </Router>
  );
}

export default App;
