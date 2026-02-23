import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isLoggedIn, getCurrentUser } from './utils/auth';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn());
  const [user, setUser] = useState(getCurrentUser());

  console.log('App component rendered. Authenticated:', isAuthenticated, 'User:', user);

  // Monitoring zalogowania
  useEffect(() => {
    setIsAuthenticated(isLoggedIn());
    setUser(getCurrentUser());
    console.log('Auth check useEffect - Authenticated:', isLoggedIn());
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Jeśli zalogowany - Dashboard, wpp Login */}
        <Route
          path="/"
          element={isAuthenticated ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />}
        />
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

