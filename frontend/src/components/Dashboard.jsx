import { useState } from 'react';
import { logout } from '../utils/auth';
import Slots from './Slots';
import Blackjack from './Blackjack';
import Roulette from './Roulette';

export default function Dashboard({ user, onLogout }) {
  const [balance, setBalance] = useState(user?.balance || 1000);
  const [currentGame, setCurrentGame] = useState(null);

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

  // Dashboard menu - nowoczesny layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header z gradient background */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-black/40 border-b border-purple-500/30">
        <div className="w-full px-2 xs:px-3 sm:px-4 lg:px-6 py-2 xs:py-3">
          <div className="flex items-center justify-between gap-2 xs:gap-3 sm:gap-4">
            {/* Logo - kompaktowe */}
            <div className="min-w-0 flex-shrink-0">
              <h1 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-black text-yellow-400 truncate flex items-center gap-1 xs:gap-2">
                <span className="text-yellow-300">🎲</span> CASINO KLUCZ
              </h1>
            </div>

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* User Profile - minimalistyczne */}
            <div className="bg-gradient-to-br from-purple-600/30 to-pink-600/30 backdrop-blur-md border border-purple-400/50 rounded px-2 xs:px-3 py-1.5 xs:py-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="hidden xs:block text-right">
                  <p className="text-xs text-purple-300 font-semibold uppercase tracking-wide leading-none">Gracz</p>
                  <p className="text-sm xs:text-base font-bold text-white truncate max-w-[120px]">{user?.username}</p>
                </div>
                <div className="h-8 xs:h-9 w-8 xs:w-9 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex-shrink-0 flex items-center justify-center text-sm xs:text-base font-bold">
                  👤
                </div>
              </div>
            </div>

            {/* Balance - zwarty */}
            <div className="bg-gradient-to-br from-emerald-600/30 to-teal-600/30 backdrop-blur-md border border-emerald-400/50 rounded px-2 xs:px-3 py-1.5 xs:py-2 flex-shrink-0">
              <p className="text-xs text-emerald-300 font-semibold uppercase tracking-wide leading-none">Saldo</p>
              <p className="text-lg xs:text-xl sm:text-2xl font-black text-emerald-300">💰 {balance}</p>
            </div>

            {/* Logout Button - mały */}
            <button
              onClick={handleLogout}
              className="px-3 xs:px-4 py-1.5 xs:py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-xs xs:text-sm rounded transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg flex-shrink-0"
            >
              Wyloguj
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full">
        {/* Hero Section */}
        <section className="w-full px-2 xs:px-3 sm:px-4 lg:px-5 xl:px-6 py-6 xs:py-8 sm:py-10">
          <div className="w-full">
            <div className="text-center space-y-2 xs:space-y-3 sm:space-y-4 mb-6 xs:mb-8 sm:mb-10">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black">
                <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 bg-clip-text text-transparent">
                  Witaj w kasynie!
                </span>
              </h2>
              <p className="text-purple-300 text-xs xs:text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed px-1">
                Wybierz swoją ulubioną grę i zacznij rozgrywkę. Powodzenia! 🍀
              </p>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mb-8 xs:mb-10 sm:mb-12 w-full">
              {/* Sloty */}
              <div
                onClick={() => setCurrentGame('slots')}
                className="group relative bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm border border-blue-400/50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 cursor-pointer transition-all duration-300 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 overflow-hidden"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10 space-y-2 xs:space-y-3 sm:space-y-4 text-center">
                  <div className="text-4xl xs:text-5xl sm:text-6xl animate-bounce">🎰</div>
                  <div>
                    <h3 className="text-lg xs:text-xl sm:text-2xl font-black text-cyan-300 mb-1">Sloty</h3>
                    <p className="text-purple-300 text-xs xs:text-sm">Obracaj bębny i wygrywaj!</p>
                  </div>
                  <button
                    onClick={() => setCurrentGame('slots')}
                    className="w-full px-3 xs:px-4 py-1.5 xs:py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-xs xs:text-sm font-bold rounded transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                  >
                    Graj Teraz →
                  </button>
                </div>
              </div>

              {/* Blackjack */}
              <div
                onClick={() => setCurrentGame('blackjack')}
                className="group relative bg-gradient-to-br from-red-600/20 to-pink-600/20 backdrop-blur-sm border border-red-400/50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 cursor-pointer transition-all duration-300 hover:border-red-400 hover:shadow-2xl hover:shadow-red-500/50 transform hover:scale-105 overflow-hidden"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10 space-y-2 xs:space-y-3 sm:space-y-4 text-center">
                  <div className="text-4xl xs:text-5xl sm:text-6xl">♠️</div>
                  <div>
                    <h3 className="text-lg xs:text-xl sm:text-2xl font-black text-red-300 mb-1">Blackjack</h3>
                    <p className="text-purple-300 text-xs xs:text-sm">Zbij 21 i pokonaj krupiera</p>
                  </div>
                  <button
                    onClick={() => setCurrentGame('blackjack')}
                    className="w-full px-3 xs:px-4 py-1.5 xs:py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-xs xs:text-sm font-bold rounded transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                  >
                    Graj Teraz →
                  </button>
                </div>
              </div>

              {/* Ruletka */}
              <div
                onClick={() => setCurrentGame('roulette')}
                className="group relative bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-sm border border-purple-400/50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5 cursor-pointer transition-all duration-300 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 overflow-hidden"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10 space-y-2 xs:space-y-3 sm:space-y-4 text-center">
                  <div className="text-4xl xs:text-5xl sm:text-6xl animate-spin" style={{animationDuration: '3s'}}>🎡</div>
                  <div>
                    <h3 className="text-lg xs:text-xl sm:text-2xl font-black text-purple-300 mb-1">Ruletka</h3>
                    <p className="text-purple-300 text-xs xs:text-sm">Obstawić i spróbuj szczęścia</p>
                  </div>
                  <button
                    onClick={() => setCurrentGame('roulette')}
                    className="w-full px-3 xs:px-4 py-1.5 xs:py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-xs xs:text-sm font-bold rounded transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                  >
                    Graj Teraz →
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mb-6 xs:mb-8 sm:mb-10">
              <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-sm border border-yellow-400/50 rounded-lg xs:rounded-xl p-3 xs:p-4">
                <p className="text-yellow-300 text-xs font-semibold uppercase tracking-wider">Całkowity wygrane</p>
                <p className="text-xl xs:text-2xl sm:text-3xl font-black text-yellow-300 mt-1">~10,000</p>
                <p className="text-yellow-400 text-xs mt-0.5">żetonów</p>
              </div>
              <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-sm border border-blue-400/50 rounded-lg xs:rounded-xl p-3 xs:p-4">
                <p className="text-blue-300 text-xs font-semibold uppercase tracking-wider">Gier rozegranych</p>
                <p className="text-xl xs:text-2xl sm:text-3xl font-black text-blue-300 mt-1">127</p>
                <p className="text-blue-400 text-xs mt-0.5">rundy</p>
              </div>
              <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm border border-green-400/50 rounded-lg xs:rounded-xl p-3 xs:p-4">
                <p className="text-green-300 text-xs font-semibold uppercase tracking-wider">Win Rate</p>
                <p className="text-xl xs:text-2xl sm:text-3xl font-black text-green-300 mt-1">42%</p>
                <p className="text-green-400 text-xs mt-0.5">zwycięstw</p>
              </div>
            </section>

            {/* Ranking Section */}
            <section className="bg-gradient-to-br from-slate-800/50 to-purple-900/50 backdrop-blur-sm border border-purple-400/50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
              <h3 className="text-lg xs:text-xl sm:text-2xl font-black text-transparent bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text mb-3 xs:mb-4">
                🏆 Top 10 Graczy
              </h3>
              <div className="space-y-1 xs:space-y-2 sm:space-y-3">
                {[
                  { rank: 1, name: 'MystyGamer', balance: 50000, emoji: '👑' },
                  { rank: 2, name: 'LuckyDraw', balance: 45500, emoji: '🥈' },
                  { rank: 3, name: 'CardMaster', balance: 42000, emoji: '🥉' },
                  { rank: 4, name: 'Ty', balance, emoji: '⭐' },
                ].map((player) => (
                  <div
                    key={player.rank}
                    className={`flex items-center justify-between p-2 xs:p-3 rounded-lg transition-all duration-300 gap-1.5 ${
                      player.name === 'Ty'
                        ? 'bg-gradient-to-r from-yellow-600/40 to-orange-600/40 border border-yellow-400/50'
                        : 'bg-slate-700/40 border border-purple-400/30 hover:border-purple-400/60'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 min-w-0 flex-1">
                      <span className="text-lg xs:text-xl font-black flex-shrink-0">{player.emoji}</span>
                      <div className="min-w-0">
                        <p className={`font-bold text-xs xs:text-sm sm:text-base truncate ${player.name === 'Ty' ? 'text-yellow-300' : 'text-white'}`}>
                          #{player.rank} {player.name}
                        </p>
                      </div>
                    </div>
                    <p className="text-base xs:text-lg sm:text-xl font-black text-emerald-300 flex-shrink-0">💰 {player.balance.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/30 bg-black/40 backdrop-blur-sm py-6 xs:py-8 px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="w-full text-center text-purple-400 text-xs xs:text-sm">
          <p>© 2026 Casino Klucz - Edukacyjna platforma do gier hazardowych</p>
          <p className="mt-2 text-purple-500">Zagraj odpowiedzialnie 🎲</p>
        </div>
      </footer>
    </div>
  );
}
