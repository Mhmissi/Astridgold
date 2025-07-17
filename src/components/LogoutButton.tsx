import React from 'react';
import { logout } from '../firebaseAuth';

export default function LogoutButton() {
  return (
    <button
      onClick={logout}
      className="bg-black border border-gold-400 text-gold-400 px-4 py-2 rounded font-bold hover:bg-gold-600 hover:text-black transition-colors"
    >
      Logout
    </button>
  );
} 