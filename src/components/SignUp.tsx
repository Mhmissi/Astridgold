import React, { useState } from 'react';
import { signUp } from '../firebaseAuth';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signUp(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <form onSubmit={handleSignUp} className="bg-black border border-gold-500 rounded-xl p-8 shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-gold-400 text-center">Sign Up</h2>
        <input
          className="w-full mb-4 px-3 py-2 rounded bg-black border border-gold-400 text-gold-400 placeholder-gold-400"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          required
        />
        <input
          className="w-full mb-4 px-3 py-2 rounded bg-black border border-gold-400 text-gold-400 placeholder-gold-400"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          required
        />
        {error && <div className="text-red-400 mb-4 text-sm">{error}</div>}
        <button type="submit" className="w-full bg-gold-500 text-black py-2 rounded font-bold hover:bg-gold-600 transition-colors mb-3">Sign Up</button>
        <div className="text-center mt-4 text-gold-400 text-sm">
          Already have an account? <a href="/login" className="underline">Login</a>
        </div>
      </form>
    </div>
  );
} 