import { useState } from 'react';
import { apiCall } from '../utils/api';
import '../styles/slots.css';

export default function Slots({ user, onBalanceUpdate, onGameEnd }) {
  const [betAmount, setBetAmount] = useState(10);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [currentBalance, setCurrentBalance] = useState(user?.balance || 0);

  // Dostępne stawki
  const betOptions = [5, 10, 20, 50, 100];

  const handleSpin = async () => {
    setError('');
    setResult(null);

    // Walidacja
    if (betAmount <= 0) {
      setError('Stawka musi być większa niż 0');
      return;
    }
    if (betAmount > currentBalance) {
      setError('Niewystarczająco żetonów');
      return;
    }

    setIsSpinning(true);

    try {
      const response = await apiCall('/games/slots', 'POST', { betAmount });

      // Symulujemy animację - czekamy 2 sekundy
      setTimeout(() => {
        setResult(response);
        setCurrentBalance(response.newBalance);
        onBalanceUpdate(response.newBalance);
        setIsSpinning(false);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Błąd gry');
      setIsSpinning(false);
    }
  };

  return (
    <div className="slots-container">
      <button className="back-button" onClick={onGameEnd}>
        ← Wróć
      </button>

      <div className="slots-card">
        <h2 className="slots-title">🎰 SLOTY</h2>

        {/* Wyświetlacz bębnów */}
        <div className="slots-display">
          <div className={`reel ${isSpinning ? 'spinning' : ''}`}>
            <span className="reel-symbol">{result?.result[0] || '🎰'}</span>
          </div>
          <div className={`reel ${isSpinning ? 'spinning' : ''}`}>
            <span className="reel-symbol">{result?.result[1] || '🎰'}</span>
          </div>
          <div className={`reel ${isSpinning ? 'spinning' : ''}`}>
            <span className="reel-symbol">{result?.result[2] || '🎰'}</span>
          </div>
        </div>

        {/* Wynik */}
        {result && !isSpinning && (
          <div
            className={`result-message ${
              result.winAmount > 0 ? 'win' : 'lose'
            }`}
          >
            <p className="result-text">{result.message}</p>
            <p className="result-amounts">
              Stawka: <span>{result.betAmount} 💰</span>
              <br />
              Wygrana: <span className={result.winAmount > 0 ? 'win-text' : 'lose-text'}>
                {result.winAmount > 0 ? '+' : '-'}{result.winAmount} 💰
              </span>
            </p>
          </div>
        )}

        {/* Błąd */}
        {error && <div className="error-message">{error}</div>}

        {/* Wybór stawki */}
        <div className="bet-selector">
          <label>Wybierz stawkę:</label>
          <div className="bet-buttons">
            {betOptions.map((amount) => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                className={`bet-button ${betAmount === amount ? 'active' : ''}`}
                disabled={isSpinning}
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
            disabled={isSpinning}
            className="bet-input"
            placeholder="Lub wpisz stawkę"
          />
        </div>

        {/* Przycisk SPIN */}
        <button
          onClick={handleSpin}
          disabled={isSpinning || betAmount <= 0 || betAmount > currentBalance}
          className="spin-button"
        >
          {isSpinning ? '⏳ Kręcę...' : '🎰 SPIN!'}
        </button>

        {/* Saldo */}
        <div className="balance-display">
          <p>Twoje saldo: <span className="balance-amount">{currentBalance} 💰</span></p>
        </div>

        {/* Info */}
        <div className="slots-info">
          <h3>💡 Zasady gry:</h3>
          <p>🍎 3x ten sam symbol = Wygrana 10x stawka</p>
          <p>🍊 2x ten sam symbol = Wygrana 2x stawka</p>
          <p>🍋 Brak powtórzenia = Przegrana</p>
        </div>
      </div>
    </div>
  );
}
