import { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';
import '../styles/blackjack.css';

export default function Blackjack({ user, onBalanceUpdate, onGameEnd }) {
  const [betAmount, setBetAmount] = useState(10);
  const [gameState, setGameState] = useState('betting'); // 'betting', 'playing', 'finished'
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerValue, setPlayerValue] = useState(0);
  const [dealerValue, setDealerValue] = useState(0);
  const [deck, setDeck] = useState([]);
  const [message, setMessage] = useState('');
  const [winAmount, setWinAmount] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(user?.balance || 0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const betOptions = [5, 10, 20, 50, 100];

  // Rozpoczęcie nowej gry
  const handleStartGame = async () => {
    if (betAmount <= 0 || betAmount > currentBalance) {
      setError('Nieprawidłowa stawka');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await apiCall('/games/blackjack', 'POST', {
        betAmount,
        action: 'start',
      });

      setPlayerHand(response.playerHand);
      setDealerHand(response.dealerHand);
      setPlayerValue(response.playerValue);
      setDealerValue(response.dealerValue);
      setDeck(response.deck);
      setMessage(response.message);
      setGameState('playing');
    } catch (err) {
      setError(err.message || 'Błąd gry');
    } finally {
      setLoading(false);
    }
  };

  // Hit - dobierz kartę
  const handleHit = async () => {
    setLoading(true);
    try {
      const response = await apiCall('/games/blackjack', 'POST', {
        betAmount,
        action: 'hit',
        playerHand,
        dealerHand,
        deck,
      });

      setPlayerHand(response.playerHand);
      setPlayerValue(response.playerValue);
      setDeck(response.deck);
      setMessage(response.message);

      if (response.gameStatus === 'bust') {
        setGameState('finished');
        setWinAmount(0);
        setCurrentBalance(currentBalance - betAmount);
        onBalanceUpdate(currentBalance - betAmount);
      }
    } catch (err) {
      setError(err.message || 'Błąd gry');
    } finally {
      setLoading(false);
    }
  };

  // Stand - zakończ grę
  const handleStand = async () => {
    setLoading(true);
    try {
      const response = await apiCall('/games/blackjack', 'POST', {
        betAmount,
        action: 'stand',
        playerHand,
        dealerHand,
        deck,
      });

      setPlayerHand(response.playerHand);
      setDealerHand(response.dealerHand);
      setPlayerValue(response.playerValue);
      setDealerValue(response.dealerValue);
      setMessage(response.message);
      setWinAmount(response.winAmount);
      setCurrentBalance(response.newBalance);
      onBalanceUpdate(response.newBalance);
      setGameState('finished');
    } catch (err) {
      setError(err.message || 'Błąd gry');
    } finally {
      setLoading(false);
    }
  };

  // Nowa gra
  const handleNewGame = () => {
    setGameState('betting');
    setPlayerHand([]);
    setDealerHand([]);
    setPlayerValue(0);
    setDealerValue(0);
    setMessage('');
    setWinAmount(0);
    setError('');
  };

  return (
    <div className="blackjack-container">
      <button className="back-button" onClick={onGameEnd}>
        ← Wróć
      </button>

      <div className="blackjack-card">
        <h2 className="blackjack-title">♠️ BLACKJACK ♥️</h2>

        {/* Faza BETTING */}
        {gameState === 'betting' && (
          <div className="betting-phase">
            <p className="phase-label">Wybierz stawkę</p>

            <div className="bet-buttons">
              {betOptions.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBetAmount(amount)}
                  className={`bet-button ${betAmount === amount ? 'active' : ''}`}
                >
                  {amount}
                </button>
              ))}
            </div>

            <input
              type="number"
              min="1"
              max={currentBalance}
              value={betAmount}
              onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
              className="bet-input"
              placeholder="Lub wpisz stawkę"
            />

            {error && <div className="error-message">{error}</div>}

            <button
              onClick={handleStartGame}
              disabled={loading || betAmount <= 0 || betAmount > currentBalance}
              className="start-button"
            >
              {loading ? '⏳ Czekaj...' : 'Graj! 🃏'}
            </button>
          </div>
        )}

        {/* Faza PLAYING i FINISHED */}
        {(gameState === 'playing' || gameState === 'finished') && (
          <div className="game-phase">
            {/* Dealer ręka */}
            <div className="dealer-section">
              <p className="section-label">Dealer</p>
              <div className="cards-display">
                {dealerHand.map((card, idx) => (
                  <div key={idx} className={`card flip ${gameState === 'finished' ? 'flipped' : ''}`}>
                    <div className="card-inner">
                      <div className="card-front">?</div>
                      <div className="card-back">
                        {card.rank}
                        <br />
                        {card.suit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="hand-value">Suma: <span className="value-text">{dealerValue}</span></p>
            </div>

            {/* Gracz ręka */}
            <div className="player-section">
              <p className="section-label">Twoja ręka</p>
              <div className="cards-display">
                {playerHand.map((card, idx) => (
                  <div key={idx} className="card flipped">
                    <div className="card-inner">
                      <div className="card-front">?</div>
                      <div className="card-back">
                        {card.rank}
                        <br />
                        {card.suit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="hand-value">Suma: <span className={`value-text ${playerValue > 21 ? 'bust' : ''}`}>{playerValue}</span></p>
            </div>

            {/* Wiadomość/wynik */}
            {message && (
              <div className={`result-message ${gameState === 'finished' && winAmount > 0 ? 'win' : gameState === 'finished' ? 'lose' : 'info'}`}>
                <p>{message}</p>
                {gameState === 'finished' && (
                  <p className="win-details">
                    {winAmount > 0 ? `+${winAmount}` : `-${betAmount}`} 💰
                  </p>
                )}
              </div>
            )}

            {/* Przyciski akcji */}
            {gameState === 'playing' && (
              <div className="action-buttons">
                <button
                  onClick={handleHit}
                  disabled={loading}
                  className="hit-button"
                >
                  {loading ? '⏳' : 'Hit 🃏'}
                </button>
                <button
                  onClick={handleStand}
                  disabled={loading}
                  className="stand-button"
                >
                  {loading ? '⏳' : 'Stand ✋'}
                </button>
              </div>
            )}

            {/* Przycisk "Nowa gra" */}
            {gameState === 'finished' && (
              <button onClick={handleNewGame} className="new-game-button">
                Nowa gra
              </button>
            )}
          </div>
        )}

        {/* Saldo */}
        <div className="balance-display">
          <p>Saldo: <span className="balance-amount">{currentBalance} 💰</span></p>
        </div>

        {/* Info */}
        <div className="blackjack-info">
          <h3>💡 Zasady gry:</h3>
          <p>🎯 Celem jest zbliżyć się do 21</p>
          <p>🃏 Karta > 21 = Przegrana (bust)</p>
          <p>⭐ Dealer muszę dobierać do 17</p>
          <p>🏆 Wygrana = 2x stawka</p>
        </div>
      </div>
    </div>
  );
}
