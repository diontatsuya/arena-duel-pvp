import React from 'react';
import Arena from './pages/Arena';
import Navbar from './components/Navbar'; // pastikan file Navbar.jsx sudah dibuat

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <h1 className="text-2xl font-bold text-center py-4">Arena Duel Game</h1>
      <Arena />
    </div>
  );
}

export default App;
