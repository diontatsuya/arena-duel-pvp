import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ArenaPVP from './pages/ArenaPVP';
import ArenaPVE from './pages/ArenaPVE';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/arena-pvp" element={<ArenaPVP />} />
        <Route path="/arena-pve" element={<ArenaPVE />} />
      </Routes>
    </Router>
  );
}

export default App;
