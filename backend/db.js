const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ścieżka do pliku bazy danych
const dbPath = path.join(__dirname, 'casino.db');

// Otwieram/tworzę bazę danych
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Błąd połączenia z bazą:', err.message);
  } else {
    console.log('✓ Połączono z bazą SQLite:', dbPath);
  }
});

// Inicjalizacja tabel
db.serialize(() => {
  // TabelaUsers
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      balance INTEGER DEFAULT 1000,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Błąd tworzenia tabeli users:', err);
    } else {
      console.log('✓ Tabela users OK');
    }
  });
});

module.exports = db;
