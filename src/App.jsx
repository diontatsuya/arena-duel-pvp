import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ArenaPVP from "./pages/ArenaPVP";
import ArenaPVE from "./pages/ArenaPVE";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pvp" element={<ArenaPVP />} />
          <Route path="/pve" element={<ArenaPVE />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
