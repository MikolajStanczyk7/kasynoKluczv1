# 🎰 CASINO KLUCZ - Edukacyjny Projekt Kasyna Online

Prosty, lokalnie działający projekt kasyna online w React + Node.js + SQLite. Idealny do nauki i uruchomienia w szkole.

---

## 📋 FAZA 1: LOGOWANIE I REJESTRACJA ✅

### ✨ Funkcje
- ✅ Rejestracja użytkownika z hasłem (bcrypt)
- ✅ Logowanie mailowe z JWT tokenem
- ✅ Przechowywanie sesji w localStorage
- ✅ Panel główny po zalogowaniu
- ✅ Wylogowanie

### 🗄️ Baza danych
- SQLite z tabelą `users`
- Kolumny: `id`, `username`, `email`, `password` (zahashowane), `balance` (1000 żetonów), `createdAt`

---

## 🚀 SZYBKI START

### Wymagania
- **Node.js** v16+ ([Pobierz](https://nodejs.org/))
- **npm** (zainstalowany z Node.js)

### Instalacja i Uruchomienie

#### 1️⃣ Backend (Express + SQLite)

```bash
cd backend
npm install
npm start
```

Backend uruchomi się na: **http://localhost:5000**

#### 2️⃣ Frontend (React + Vite + Tailwind)

W nowym terminalu:

```bash
cd frontend
npm install
npm run dev
```

Frontend uruchomi się na: **http://localhost:5174**

---

## 🧪 TESTOWANIE

Otwórz przeglądarkę: **http://localhost:5174**

### Ekran Logowania
- **Opcja 1**: Nowa rejestracja (kliknij "Zarejestruj")
  - Wpisz: username, email, hasło (min 6 znaków)
  - Kliknij "Zarejestruj się"

- **Opcja 2**: Testowe konto  
  - Email: `test@test.com`
  - Hasło: `haslo123`

### Po Zalogowaniu
- Widaczny panel główny z pozdrowiem
- Aktualne saldo: **1000 żetonów**
- Menu czterech gier (wkrótce...)
- Przycisk logout

---

## 📁 Struktura Projektu

```
reactCasinoKlucz/
├── backend/
│   ├── server.js               # Główny serwer Express
│   ├── db.js                   # Konfiguracja SQLite
│   ├── casino.db               # ← Baza danych (tworzy się sama)
│   ├── middleware/
│   │   └── auth.js             # Weryfikacja JWT
│   ├── routes/
│   │   └── auth.js             # /register, /login
│   ├── .env                    # PORT, JWT_SECRET
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx       # Formularz logowania/rejestracji
    │   │   └── Dashboard.jsx   # Panel główny
    │   ├── utils/
    │   │   ├── api.js          # Funkcje API
    │   │   └── auth.js         # Zarządzanie tokenem
    │   ├── index.css           # Tailwind CSS
    │   ├── App.jsx             # Router
    │   └── main.jsx
    ├── .env.local              # VITE_API_URL
    ├── tailwind.config.js
    ├── package.json
    └── index.html
```

---

## 🔌 API - Faza 1 (Dostępne endpointy)

### Autentykacja

**POST** `/auth/register`
```json
{
  "username": "gracz123",
  "email": "gracz@test.com",
  "password": "haslo123"
}
```
Response: `{ token, user: { id, username, balance } }`

**POST** `/auth/login`
```json
{
  "email": "gracz@test.com",
  "password": "haslo123"
}
```
Response: `{ token, user: { id, username, balance } }`

### Użytkownik (wymaga tokena!)

**GET** `/users/profile`
- Nagłówek: `Authorization: Bearer <token>`
- Response: `{ id, username, email, balance }`

**PUT** `/users/balance`
- Body: `{ "newBalance": 950 }`
- Response: `{ message, balance }`

**GET** `/health`
- Zwraca status serwera

---

## 🛠️ Troubleshooting

### Port już zajęty
- Backend: zmień `PORT` w `.env` na inny (np. 5001)
- Frontend: Vite automatycznie spróbuje następny port

### Błąd bazy danych
- Usuń `backend/casino.db` i uruchom serwer ponownie
- Baza stworzy się automatycznie

### CORS error
- Sprawdź czy `VITE_API_URL` w `frontend/.env.local` wskazuje na `http://localhost:5000`

---

## 📝 KOLEJNE FAZY

- **FAZA 2**: Komponent Dashboard z menu gier
- **FAZA 3**: Gra SLOTY (3 bębny, animacje, logika wygranej)
- **FAZA 4**: Gra BLACKJACK (karty, zasady 21)
- **FAZA 5**: Gra RULETKA (koło, zakłady kolor/parzystość)
- **FAZA 6**: Ranking TOP 10 graczy

---

## 💾 Notatki Edukacyjne

- **Frontend**: React + React Router + Tailwind CSS
- **Backend**: Express + SQLite3 + JWT
- **Bezpieczeństwo**: Hasła hashowane bcrypt, tokeny JWT (24h)
- **Kod**: Angielski, komentarze po polsku
- **Baza**: Pojedynczy plik `casino.db` - brak instalacji serwera bazodanowego!

---

## 📜 Licencja

Projekt edukacyjny - wolny do użytku w celach nauki.

---

## 🎓 Autorzy

Stworzono dla uczniów szkół zainteresowanych React i Node.js.

Powodzenia! 🎰✨
