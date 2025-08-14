import { Routes, Route } from 'react-router-dom';
import App from '../App.jsx';
import Home from '../pages/Home.jsx';
import ArenaBattle from '../pages/ArenaBattle.jsx';

export default function AppRoutes() {
  return (
    <App>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/arena-battle" element={<ArenaBattle />} />
      </Routes>
    </App>
  );
}
