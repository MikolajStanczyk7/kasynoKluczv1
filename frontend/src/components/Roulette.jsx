import { useState, useRef } from 'react';
import { apiCall } from '../utils/api';
import '../styles/roulette.css';

export default function Roulette({ user, onBalanceUpdate, onGameEnd }) {
  const wheelRef = useRef(null);
  const [betAmount, setBetAmount] = useState(10);
  const [betType, setBetType] = useState('red');
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);
  const [message, setMessage] = useState('');
  const [winAmount, setWinAmount] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(user?.balance || 0);
  const [error, setError] = useState('');
  const [won, setWon] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);

  const betOptions = [5, 10, 20, 50, 100];

  const handleSpin = async () => {
    setError('');
    setSpinResult(null);

    // Walidacja
    if (betAmount <= 0 || betAmount > currentBalance) {
      setError('Nieprawidłowa stawka');
      return;
    }

    setIsSpinning(true);

    try {
      console.log('Wysyłam request do /games/roulette', { betAmount, betType });
      const response = await apiCall('/games/roulette', 'POST', {
        betAmount,
        betType,
      });
      console.log('Odpowiedź:', response);

      // Obliczanie finalne rotacji - każda liczba zajmuje 360/37 stopni
      // Aby liczba była na wskaźniku u góry:Rotacja = 360 - (spinResult * 360 / 37)
      const anglePerNumber = 360 / 37;
      const finalRotation = (360 - (response.spinResult * anglePerNumber)) % 360;

      console.log(`Wylosowana liczba: ${response.spinResult}, finalna rotacja: ${finalRotation}°`);

      // Animacja kręcenia koła 5 pełnych obrotów
      if (wheelRef.current) {
        const animation = wheelRef.current.animate(
          [
            { transform: 'rotate(0deg)' },
            { transform: 'rotate(1800deg)' }
          ],
          {
            duration: 3000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fill: 'none'
          }
        );
      }

      // Po animacji (3 sekundy) ustaw prawidłową rotację i wyniki
      setTimeout(() => {
        // Ustaw prawidłową rotację na element
        if (wheelRef.current) {
          wheelRef.current.style.transform = `rotate(${finalRotation}deg)`;
        }
        // Aktualizuj state
        setWheelRotation(finalRotation);
        setSpinResult(response.spinResult);
        setMessage(response.message);
        setWinAmount(response.winAmount);
        setWon(response.won);
        setCurrentBalance(response.newBalance);
        onBalanceUpdate(response.newBalance);
        setIsSpinning(false);
      }, 3000);
    } catch (err) {
      console.error('Błąd w handleSpin:', err);
      setError(err.message || 'Błąd gry');
      setIsSpinning(false);
    }
  };

  return (
    <div className="roulette-container">
      <button className="back-button" onClick={onGameEnd}>
        ← Wróć
      </button>

      <div className="roulette-card">
        <h2 className="roulette-title">🎡 RULETKA 🎡</h2>

        {/* Koło ruletki */}
        <div className="roulette-wheel-wrapper">
          <div
            ref={wheelRef}
            className="roulette-wheel"
            style={{
              transform: `rotate(${wheelRotation}deg)`
            }}
          >
            {/* Liczby na kole */}
            {Array.from({ length: 37 }, (_, i) => {
              const angle = (i * 360 / 37);
              return (
                <div 
                  key={i} 
                  className={`wheel-number ${i === 0 ? 'zero' : i <= 18 ? 'red' : 'black'}`}
                  style={{
                    transform: `rotate(${angle}deg) translateY(-120px) rotate(-${angle}deg)`
                  }}
                >
                  {i}
                </div>
              );
            })}
          </div>
          {/* Wskaźnik */}
          <div className="roulette-pointer"></div>
        </div>

        {/* Wynik spinu */}
        {spinResult !== null && (
          <div className={`spin-result ${won ? 'win' : 'lose'}`}>
            <p className="result-number">Wypadła liczba: <span className="number-text">{spinResult}</span></p>
            {message && <p className="result-message">{message}</p>}
            <p className="result-amounts">
              Stawka: <span>{betAmount} 💰</span>
              <br />
              Wygrana: <span className={won ? 'win-text' : 'lose-text'}>
                {won ? `+${winAmount}` : `-${betAmount}`} 💰
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

        {/* Wybór typu zakładu */}
        <div className="bet-type-selector">
          <label>Wybierz typ zakładu:</label>
          <div className="bet-type-buttons">
            <button
              onClick={() => setBetType('red')}
              className={`bet-type-button red-bet ${betType === 'red' ? 'active' : ''}`}
              disabled={isSpinning}
            >
              🔴 Czerwone
            </button>
            <button
              onClick={() => setBetType('black')}
              className={`bet-type-button black-bet ${betType === 'black' ? 'active' : ''}`}
              disabled={isSpinning}
            >
              ⚫ Czarne
            </button>
            <button
              onClick={() => setBetType('even')}
              className={`bet-type-button even-bet ${betType === 'even' ? 'active' : ''}`}
              disabled={isSpinning}
            >
              🔢 Parzyste
            </button>
            <button
              onClick={() => setBetType('odd')}
              className={`bet-type-button odd-bet ${betType === 'odd' ? 'active' : ''}`}
              disabled={isSpinning}
            >
              🎲 Nieparzyste
            </button>
          </div>
        </div>

        {/* Przycisk SPIN */}
        <button
          onClick={handleSpin}
          disabled={isSpinning || betAmount <= 0 || betAmount > currentBalance}
          className="spin-button"
        >
          {isSpinning ? '⏳ Kręcę...' : '🎡 SPIN!'}
        </button>

        {/* Saldo */}
        <div className="balance-display">
          <p>Twoje saldo: <span className="balance-amount">{currentBalance} 💰</span></p>
        </div>

        {/* Info */}
        <div className="roulette-info">
          <h3>💡 Zasady gry:</h3>
          <p>🔴 Czerwone = liczby 1-18 (za wyjątkiem 0)</p>
          <p>⚫ Czarne = liczby 19-36</p>
          <p>🔢 Parzyste = 2, 4, 6, ..., 36</p>
          <p>🎲 Nieparzyste = 1, 3, 5, ..., 35</p>
          <p>💰 Wygrana = 2x stawka</p>
        </div>
      </div>
    </div>
  );
}
