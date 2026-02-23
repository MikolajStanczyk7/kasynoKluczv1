const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

// POST /auth/register - Rejestracja nowego użytkownika
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Walidacja
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Brakuje danych: username, email, password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Hasło musi mieć co najmniej 6 znaków' });
    }

    // Hashowanie hasła
    const hashedPassword = await bcrypt.hash(password, 10);

    // Wstawienie do bazy
    db.run(
      'INSERT INTO users (username, email, password, balance) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, 1000],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Użytkownik lub email już istnieje' });
          }
          return res.status(500).json({ error: 'Błąd rejestracji' });
        }

        // Tworzenie tokena
        const user = { id: this.lastID, username, email };
        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({
          message: 'Rejestracja sukces',
          token,
          user: { id: user.id, username: user.username, balance: 1000 },
        });
      }
    );
  } catch (err) {
    console.error('Błąd /register:', err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

// POST /auth/login - Logowanie użytkownika
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Walidacja
    if (!email || !password) {
      return res.status(400).json({ error: 'Brakuje email lub hasła' });
    }

    // Szukamy użytkownika
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Błąd bazy datos' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Zły email lub hasło' });
      }

      // Porównanie hasła
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Zły email lub hasło' });
      }

      // Tworzenie tokena
      const tokenUser = { id: user.id, username: user.username, email: user.email };
      const token = jwt.sign(tokenUser, process.env.JWT_SECRET, { expiresIn: '24h' });

      res.json({
        message: 'Login sukces',
        token,
        user: {
          id: user.id,
          username: user.username,
          balance: user.balance,
        },
      });
    });
  } catch (err) {
    console.error('Błąd /login:', err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

module.exports = router;
