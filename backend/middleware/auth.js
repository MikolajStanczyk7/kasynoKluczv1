const jwt = require('jsonwebtoken');

// Middleware do weryfikacji JWT tokena
const authenticateToken = (req, res, next) => {
  // Token jest w nagłówku Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Brak tokena - najpierw się zaloguj' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token nieważny lub wygasły' });
    }
    req.user = user; // Zapisuję dane użytkownika z tokena
    next();
  });
};

module.exports = { authenticateToken };
