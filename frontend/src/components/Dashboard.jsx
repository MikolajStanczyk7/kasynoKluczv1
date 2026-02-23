import { useState } from 'react';
import { logout } from '../utils/auth';
import Slots from './Slots';
import Blackjack from './Blackjack';
import Roulette from './Roulette';

export default function Dashboard({ user, onLogout }) {
  const [balance, setBalance] = useState(user?.balance || 1000);
  const [currentGame, setCurrentGame] = useState(null); // 'slots', 'blackjack', 'roulette' lub null

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const handleBalanceUpdate = (newBalance) => {
    setBalance(newBalance);
  };

  // Jeśli wybrana jest gra - wyświetl komponent gry
  if (currentGame === 'slots') {
    return (
      <Slots
        user={{ ...user, balance }}
        onBalanceUpdate={handleBalanceUpdate}
        onGameEnd={() => setCurrentGame(null)}
      />
    );
  }

  if (currentGame === 'blackjack') {
    return (
      <Blackjack
        user={{ ...user, balance }}
        onBalanceUpdate={handleBalanceUpdate}
        onGameEnd={() => setCurrentGame(null)}
      />
    );
  }

  if (currentGame === 'roulette') {
    return (
      <Roulette
        user={{ ...user, balance }}
        onBalanceUpdate={handleBalanceUpdate}
        onGameEnd={() => setCurrentGame(null)}
      />
    );
  }

  // Inaczej - dashboard menu
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark to-darker text-white">
      {/* Header */}
      <header className="bg-darker border-b border-gold p-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gold">🎰 CASINO KLUCZ</h1>
            <p className="text-gray-400">Edukacyjne kasyno online</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400">Zalogowany: <span className="text-gold font-bold">{user?.username}</span></p>
            <p className="text-2xl font-bold text-gold mb-2">💰 {balance} żetonów</p>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold transition"
            >
              Wyloguj
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto p-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gold mb-4">Witaj w kasynie!</h2>
          <p className="text-gray-400 text-lg">Wybierz grę i zacznij rozgrywkę</p>
        </div>

        {/* Gry - placeholder dla FAZY następnych */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sloty */}
          <div className="bg-darker border-2 border-gold rounded-lg p-6 text-center hover:shadow-lg hover:shadow-gold transition cursor-pointer"
            onClick={() => setCurrentGame('slots')}>
            <div className="text-5xl mb-4">🎰</div>
            <h3 className="text-2xl font-bold text-gold mb-2">Sloty</h3>
            <p className="text-gray-400 mb-4">Obracaj bębny i wygrywaj!</p>
            <button
              onClick={() => setCurrentGame('slots')}
              className="bg-gold hover:bg-yellow-500 text-dark px-6 py-2 rounded font-semibold transition"
            >
              Graj →
            </button>
          </div>

          {/* Blackjack */}
          <div className="bg-darker border-2 border-gold rounded-lg p-6 text-center hover:shadow-lg hover:shadow-gold transition cursor-pointer"
            onClick={() => setCurrentGame('blackjack')}>
            <div className="text-5xl mb-4">♠️</div>
            <h3 className="text-2xl font-bold text-gold mb-2">Blackjack</h3>
            <p className="text-gray-400 mb-4">Zbij 21 i pokonaj krupiera</p>
            <button
              onClick={() => setCurrentGame('blackjack')}
              className="bg-gold hover:bg-yellow-500 text-dark px-6 py-2 rounded font-semibold transition"
            >
              Graj →
            </button>
          </div>

          {/* Ruletka */}
          <div className="bg-darker border-2 border-gold rounded-lg p-6 text-center hover:shadow-lg hover:shadow-gold transition cursor-pointer"
            onClick={() => setCurrentGame('roulette')}>
            <div className="text-5xl mb-4">🎡</div>
            <h3 className="text-2xl font-bold text-gold mb-2">Ruletka</h3>
            <p className="text-gray-400 mb-4">Obstawić i spróbuj szczęścia</p>
            <button
              onClick={() => setCurrentGame('roulette')}
              className="bg-gold hover:bg-yellow-500 text-dark px-6 py-2 rounded font-semibold transition"
            >
              Graj →
            </button>
          </div>
        </div>

        {/* Ranking - placeholder */}
        <div className="mt-12 bg-darker border-2 border-gold rounded-lg p-6">
          <h3 className="text-2xl font-bold text-gold mb-4">🏆 Top 10 Graczy</h3>
          <p className="text-gray-400">Ranking wkrótce...</p>
        </div>
      </main>
    </div>
  );
}
