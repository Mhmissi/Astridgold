import React, { useState } from 'react';
import { auth } from '../firebaseAuth';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function PasswordReset() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <form onSubmit={handleReset} className="bg-black border border-gold-500 rounded-xl p-8 shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-gold-400 text-center">Reset Password</h2>
        <input
          className="w-full mb-4 px-3 py-2 rounded bg-black border border-gold-400 text-gold-400 placeholder-gold-400"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          required
        />
        {message && <div className="text-green-400 mb-4 text-sm">{message}</div>}
        {error && <div className="text-red-400 mb-4 text-sm">{error}</div>}
        <button type="submit" className="w-full bg-gold-500 text-black py-2 rounded font-bold hover:bg-gold-600 transition-colors mb-3">Send Reset Email</button>
        <div className="text-center mt-4 text-gold-400 text-sm">
          <a href="/login" className="underline">Back to Login</a>
        </div>
      </form>
    </div>
  );
} 