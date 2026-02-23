import { useState } from 'react';
import { login, register } from '../utils/auth';

export default function Login({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (isRegistering) {
        response = await register(formData.username, formData.email, formData.password);
      } else {
        response = await login(formData.email, formData.password);
      }

      // Na success zaloguj użytkownika
      onLogin(response.user);
    } catch (err) {
      setError(err.message || 'Błąd');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark to-darker flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gold mb-2">🎰 CASINO</h1>
          <p className="text-gray-400">Edukacyjne kasyno online</p>
        </div>

        {/* Karty logowania */}
        <div className="bg-darker border-2 border-gold rounded-lg p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-gold">
            {isRegistering ? 'Rejestracja' : 'Logowanie'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username - tylko przy rejestracji */}
            {isRegistering && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                  Nazwa użytkownika
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required={isRegistering}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-gold focus:outline-none"
                  placeholder="twoja_nazwa"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-gold focus:outline-none"
                placeholder="twoj@email.com"
              />
            </div>

            {/* Hasło */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Hasło
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:border-gold focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            {/* Błąd */}
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-2 rounded">
                {error}
              </div>
            )}

            {/* Przycisk submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-yellow-500 text-dark font-bold py-2 px-4 rounded transition disabled:opacity-50"
            >
              {loading ? 'Czekaj...' : isRegistering ? 'Zarejestruj się' : 'Zaloguj'}
            </button>
          </form>

          {/* Toggle rejestracja/logowanie */}
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              {isRegistering ? 'Masz już konto?' : 'Nie masz konta?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                  setFormData({ username: '', email: '', password: '' });
                }}
                className="text-gold hover:text-yellow-500 font-semibold"
              >
                {isRegistering ? 'Zaloguj się' : 'Zarejestruj'}
              </button>
            </p>
          </div>
        </div>

        {/* Info dla testowania */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>🧪 Test: email@test.com / hasło123</p>
        </div>
      </div>
    </div>
  );
}
