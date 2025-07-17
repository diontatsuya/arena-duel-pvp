import React from 'react';
import Arena from './pages/Arena';
import Header from './components/Header';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-center py-6">Arena Duel Game</h1>
        <Arena />
      </main>
    </div>
  );
}

export default App;
