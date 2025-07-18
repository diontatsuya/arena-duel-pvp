import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ConnectWallet from "./components/ConnectWallet";
import GameArena from "./components/GameArena";
import ArenaPVP from "./components/ArenaPVP";
import ArenaPVE from "./components/ArenaPVE";
import ArenaUI from "./components/ArenaUI"; // Tambahan untuk mode debug

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ConnectWallet />} />
        <Route path="/arena" element={<GameArena />} />
        <Route path="/arena-pvp" element={<ArenaPVP />} />
        <Route path="/arena-pve" element={<ArenaPVE />} />
        <Route path="/debug" element={<ArenaUI />} /> {/* Halaman debug */}
      </Routes>
    </Router>
  );
}

export default App;
