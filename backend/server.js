require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const authRoutes = require('./routes/auth');
const gamesRoutes = require('./routes/games');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/games', gamesRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend działa' });
});

// GET /users/profile - Profil zalogowanego użytkownika (chroniony)
app.get('/users/profile', authenticateToken, (req, res) => {
  db.get('SELECT id, username, email, balance FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Błąd bazy danych' });
    }
    if (!user) {
      return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
    }
    res.json(user);
  });
});

// PUT /users/balance - Aktualizacja salda (chronione)
app.put('/users/balance', authenticateToken, (req, res) => {
  const { newBalance } = req.body;

  if (typeof newBalance !== 'number') {
    return res.status(400).json({ error: 'newBalance musi być liczbą' });
  }

  db.run(
    'UPDATE users SET balance = ? WHERE id = ?',
    [newBalance, req.user.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Błąd aktualizacji' });
      }
      res.json({ message: 'Saldo zaktualizowane', balance: newBalance });
    }
  );
});

// Start serwera
app.listen(PORT, () => {
  console.log(`\n🎰 CASINO BACKEND URUCHOMIONY`);
  console.log(`📌 http://localhost:${PORT}`);
  console.log(`✓ Baza danych: casino.db`);
  console.log('\n');
});
