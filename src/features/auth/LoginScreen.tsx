// src/features/auth/LoginScreen.tsx

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function LoginScreen() {
  const { login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isRegistering) {
        await register(email, password);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          🍽️ Meal Planner
        </h1>
        <p className="text-gray-600 text-center mb-8">
          {isRegistering ? 'Créer un compte' : 'Connexion'}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ton@email.com"
            required
          />
          
          <Input
            type="password"
            label="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <Button type="submit" className="w-full">
            {isRegistering ? 'Créer mon compte' : 'Se connecter'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-600 hover:underline text-sm"
          >
            {isRegistering 
              ? 'Déjà un compte ? Se connecter' 
              : 'Pas de compte ? S\'inscrire'}
          </button>
        </div>
      </div>
    </div>
  );
}
