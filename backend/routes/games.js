const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Symbole w slotach
const SYMBOLS = ['🍎', '🍊', '🍋', '🍇', '⭐', '💎'];

// POST /games/slots - Gra w sloty
router.post('/slots', authenticateToken, (req, res) => {
  try {
    const { betAmount } = req.body;

    // Walidacja stawki
    if (!betAmount || betAmount <= 0) {
      return res.status(400).json({ error: 'Stawka musi być większa niż 0' });
    }

    // Pobranie aktualnego salda gracza
    db.get('SELECT balance FROM users WHERE id = ?', [req.user.id], (err, user) => {
      if (err || !user) {
        return res.status(500).json({ error: 'Błąd bazy danych' });
      }

      // Sprawdzenie czy gracz ma wystarczająco żetonów
      if (user.balance < betAmount) {
        return res.status(400).json({ error: 'Niewystarczająco żetonów' });
      }

      // Losowanie 3 bębnów
      const reel1 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      const reel2 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      const reel3 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

      // Logika wygranej:
      // 3x ten sam symbol = 10x stawka
      // 2x ten sam symbol = 2x stawka
      // Brak powtórzenia = -stawka (wygrana 0)
      let winAmount = 0;

      if (reel1 === reel2 && reel2 === reel3) {
        // 3x match
        winAmount = betAmount * 10;
      } else if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
        // 2x match
        winAmount = betAmount * 2;
      }
      // Brak matcha = winAmount = 0

      // Obliczenie nowego salda
      const resultBalance = user.balance - betAmount + winAmount;

      // Aktualizacja salda
      db.run(
        'UPDATE users SET balance = ? WHERE id = ?',
        [resultBalance, req.user.id],
        (updateErr) => {
          if (updateErr) {
            return res.status(500).json({ error: 'Błąd aktualizacji salda' });
          }

          // Zwróć wynik gry
          res.json({
            result: [reel1, reel2, reel3],
            betAmount,
            winAmount,
            newBalance: resultBalance,
            message:
              winAmount > 0
                ? `Gratulacje! Wygrałeś ${winAmount} żetonów! 🎉`
                : 'Niestety przegrałeś 😢',
          });
        }
      );
    });
  } catch (err) {
    console.error('Błąd /games/slots:', err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

// ============================================
// BLACKJACK
// ============================================

// Talia kart
function createDeck() {
  const suits = ['♠️', '♥️', '♦️', '♣️'];
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const deck = [];

  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({ rank, suit });
    }
  }

  return deck.sort(() => Math.random() - 0.5); // Shuffle
}

// Wartość karty (dla blackjacka)
function getCardValue(card) {
  if (card.rank === 'J' || card.rank === 'Q' || card.rank === 'K') {
    return 10;
  }
  if (card.rank === 'A') {
    return 11; // Atus uzywamy jako 11, później obsługujemy konwersję
  }
  return parseInt(card.rank);
}

// Obliczenie sumy ręki z obsługą Asów (11 lub 1)
function calculateHandValue(hand) {
  let sum = 0;
  let aces = 0;

  for (let card of hand) {
    if (card.rank === 'A') {
      aces++;
      sum += 11;
    } else if (card.rank === 'J' || card.rank === 'Q' || card.rank === 'K') {
      sum += 10;
    } else {
      sum += parseInt(card.rank);
    }
  }

  // Jeśli suma > 21, zmniejsz Asy z 11 na 1
  while (sum > 21 && aces > 0) {
    sum -= 10;
    aces--;
  }

  return sum;
}

// POST /games/blackjack - Gra w blackjacka
router.post('/blackjack', authenticateToken, (req, res) => {
  try {
    const { betAmount, action, playerHand, dealerHand, deck } = req.body;

    // Walidacja stawki
    if (!betAmount || betAmount <= 0) {
      return res.status(400).json({ error: 'Stawka musi być większa niż 0' });
    }

    // Pobranie aktualnego salda gracza
    db.get('SELECT balance FROM users WHERE id = ?', [req.user.id], (err, user) => {
      if (err || !user) {
        return res.status(500).json({ error: 'Błąd bazy danych' });
      }

      // Jeśli to nowa gra
      if (!action || action === 'start') {
        // Sprawdzenie czy gracz ma wystarczająco żetonów
        if (user.balance < betAmount) {
          return res.status(400).json({ error: 'Niewystarczająco żetonów' });
        }

        const newDeck = createDeck();
        const pHand = [newDeck.pop(), newDeck.pop()];
        const dHand = [newDeck.pop(), newDeck.pop()];

        return res.json({
          playerHand: pHand,
          dealerHand: dHand,
          deck: newDeck,
          playerValue: calculateHandValue(pHand),
          dealerValue: calculateHandValue(dHand),
          gameStatus: 'playing',
          message: 'Start gry!',
        });
      }

      // Hit - dobierz kartę
      if (action === 'hit') {
        const newDeck = [...deck];
        if (newDeck.length === 0) {
          return res.status(400).json({ error: 'Brak kart w talii' });
        }

        const newCard = newDeck.pop();
        const newPlayerHand = [...playerHand, newCard];
        const newPlayerValue = calculateHandValue(newPlayerHand);

        let gameStatus = 'playing';
        let message = 'Dobrana karta';

        if (newPlayerValue > 21) {
          gameStatus = 'bust';
          message = 'Przebili się! Przegrana 😢';
        }

        return res.json({
          playerHand: newPlayerHand,
          dealerHand: dealerHand,
          deck: newDeck,
          playerValue: newPlayerValue,
          dealerValue: calculateHandValue(dealerHand),
          gameStatus,
          message,
        });
      }

      // Stand - zakończ grę
      if (action === 'stand') {
        let newDealerHand = [...dealerHand];
        let newDeck = [...deck];

        // Dealer dobiera karty dopóki ma < 17
        while (calculateHandValue(newDealerHand) < 17) {
          if (newDeck.length === 0) break;
          newDealerHand.push(newDeck.pop());
        }

        const playerValue = calculateHandValue(playerHand);
        const dealerValue = calculateHandValue(newDealerHand);

        let winAmount = 0;
        let gameResult = '';

        if (dealerValue > 21) {
          winAmount = betAmount * 2; // Dealer się przebił
          gameResult = 'Dealer przebił się! Wygrana! 🎉';
        } else if (playerValue > dealerValue) {
          winAmount = betAmount * 2; // Gracz ma więcej
          gameResult = 'Masz więcej niż dealer! Wygrana! 🎉';
        } else if (playerValue === dealerValue) {
          winAmount = betAmount; // Remis
          gameResult = 'Remis! Odzyskujesz stawkę.';
        } else {
          gameResult = 'Dealer ma więcej. Przegrana 😢';
        }

        // Obliczenie nowego salda
        const resultBalance = user.balance - betAmount + winAmount;

        // Aktualizacja salda w bazie
        db.run(
          'UPDATE users SET balance = ? WHERE id = ?',
          [resultBalance, req.user.id],
          (updateErr) => {
            if (updateErr) {
              return res.status(500).json({ error: 'Błąd aktualizacji salda' });
            }

            res.json({
              playerHand,
              dealerHand: newDealerHand,
              playerValue,
              dealerValue,
              gameStatus: 'finished',
              winAmount,
              newBalance: resultBalance,
              message: gameResult,
            });
          }
        );
      }
    });
  } catch (err) {
    console.error('Błąd /games/blackjack:', err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

// ============================================
// RULETKA
// ============================================

// POST /games/roulette - Gra w ruletkę
router.post('/roulette', authenticateToken, (req, res) => {
  try {
    const { betAmount, betType, betValue } = req.body;

    // Walidacja stawki
    if (!betAmount || betAmount <= 0) {
      return res.status(400).json({ error: 'Stawka musi być większa niż 0' });
    }

    // Walidacja typu zakładu
    const validBetTypes = ['red', 'black', 'even', 'odd'];
    if (!betType || !validBetTypes.includes(betType)) {
      return res.status(400).json({ error: 'Nieprawidłowy typ zakładu' });
    }

    // Pobranie aktualnego salda gracza
    db.get('SELECT balance FROM users WHERE id = ?', [req.user.id], (err, user) => {
      if (err || !user) {
        return res.status(500).json({ error: 'Błąd bazy danych' });
      }

      // Sprawdzenie czy gracz ma wystarczająco żetonów
      if (user.balance < betAmount) {
        return res.status(400).json({ error: 'Niewystarczająco żetonów' });
      }

      // Losowanie liczby (0-36)
      const spinResult = Math.floor(Math.random() * 37);

      // Określenie koloru (0 = green, 1-18 = red, 19-36 = black)
      let color = 'green';
      if (spinResult >= 1 && spinResult <= 18) {
        color = 'red';
      } else if (spinResult >= 19 && spinResult <= 36) {
        color = 'black';
      }

      // Parzystość
      const parity = spinResult === 0 ? 'none' : spinResult % 2 === 0 ? 'even' : 'odd';

      // Określenie wygranej
      let won = false;
      if (betType === 'red' && color === 'red') won = true;
      if (betType === 'black' && color === 'black') won = true;
      if (betType === 'even' && parity === 'even') won = true;
      if (betType === 'odd' && parity === 'odd') won = true;

      // Wyliczenie wygranej
      let winAmount = 0;
      let message = '';

      if (won) {
        winAmount = betAmount * 2; // 2x zwrot (stawka + wygrana)
        message = `Wygrana! ${betType} = Liczba ${spinResult} 🎉`;
      } else {
        message = `Przegrana... Liczba ${spinResult} (${color}) 😢`;
      }

      // Obliczenie nowego salda
      const resultBalance = user.balance - betAmount + winAmount;

      // Aktualizacja salda
      db.run(
        'UPDATE users SET balance = ? WHERE id = ?',
        [resultBalance, req.user.id],
        (updateErr) => {
          if (updateErr) {
            return res.status(500).json({ error: 'Błąd aktualizacji salda' });
          }

          res.json({
            spinResult,
            color,
            parity,
            betType,
            betAmount,
            won,
            winAmount,
            newBalance: resultBalance,
            message,
          });
        }
      );
    });
  } catch (err) {
    console.error('Błąd /games/roulette:', err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

// GET /games/ranking - Pobranie top 10 graczy
router.get('/ranking', (req, res) => {
  try {
    // Pobierz top 10 graczy sortowanych po balansie malejąco
    db.all(
      'SELECT id, username, balance FROM users ORDER BY balance DESC LIMIT 10',
      (err, rows) => {
        if (err) {
          console.error('Błąd pobierania rankingu:', err);
          return res.status(500).json({ error: 'Błąd serwera' });
        }

        // Mapuj wyniki na format z rankingiem
        const ranking = rows.map((row, index) => ({
          rank: index + 1,
          name: row.username,
          balance: row.balance,
          id: row.id,
        }));

        res.json(ranking);
      }
    );
  } catch (err) {
    console.error('Błąd /games/ranking:', err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

module.exports = router;
