import React, { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import LogoutButton from './LogoutButton';

interface HeaderProps {
  cartCount: number;
  onCartClick?: () => void;
}

const navLinks = [
  { label: 'Home', section: 'home' },
  { label: 'Services', section: 'services' },
  { label: 'Luxury Watches & Diamonds', section: 'luxury' },
  { label: 'About', section: 'about' },
  { label: 'Contact', section: 'contact' },
];

const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Helper for nav links: if already on '/', scroll, else navigate with state
  const handleNav = (section: string) => {
    if (location.pathname === '/') {
      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
      }
    } else {
      navigate('/', { state: { scrollTo: section } });
      setIsMenuOpen(false);
    }
  };

  const languages = [
    { code: 'en', name: 'EN', fullName: 'English' },
    { code: 'nl', name: 'NL', fullName: 'Nederlands' },
    { code: 'fr', name: 'FR', fullName: 'Français' }
  ];

  return (
    <header className="fixed w-full top-0 z-50 bg-black/95 backdrop-blur-md border-b border-gold-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img 
                src="https://ik.imagekit.io/by733ltn6/Astrid%20Gold%20logo%20%20whait/astrid%20logo%20%20gold%20black.png?updatedAt=1750789116389"
                alt="Astrid Gold"
                className="h-12 w-auto"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navLinks.map(link => (
                <button
                  key={link.section}
                  onClick={() => handleNav(link.section)}
                  className="text-white hover:text-gold-400 px-3 py-2 text-sm font-medium font-serif transition-colors duration-300"
                >
                  {link.label}
                </button>
              ))}
              <Link
                to="/shop"
                className="text-white hover:text-gold-400 px-3 py-2 text-sm font-medium font-serif transition-colors duration-300"
              >
                Shop
              </Link>
            </div>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="flex items-center space-x-1 text-sm">
              {languages.map((lang, index) => (
                <React.Fragment key={lang.code}>
                  <button
                    onClick={() => setCurrentLang(lang.code)}
                    className={`px-2 py-1 font-serif transition-colors duration-300 ${
                      currentLang === lang.code 
                        ? 'text-gold-400 font-bold' 
                        : 'text-white hover:text-gold-400'
                    }`}
                  >
                    {lang.name}
                  </button>
                  {index < languages.length - 1 && (
                    <span className="text-gray-500">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            {/* Auth links */}
            {user ? (
              <>
                <span className="text-gold-400 font-serif text-sm">{user.email}</span>
                <Link to="/profile" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gold-900 transition-colors" title="Profile">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gold-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
                  </svg>
                </Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link to="/login" className="text-gold-400 font-serif px-3 py-2 text-sm hover:underline">Login</Link>
                <Link to="/signup" className="text-gold-400 font-serif px-3 py-2 text-sm hover:underline">Sign Up</Link>
              </>
            )}
            {/* Cart Icon */}
            <button
              onClick={onCartClick}
              className="relative flex items-center px-3 py-2 text-white hover:text-gold-400 transition-colors"
              aria-label="View cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0l1.7 6.385a2.25 2.25 0 002.183 1.693h7.063a2.25 2.25 0 002.183-1.693l1.7-6.385m-13.216 0h13.216M6.75 21a.75.75 0 100-1.5.75.75 0 000 1.5zm10.5 0a.75.75 0 100-1.5.75.75 0 000 1.5z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-black text-xs font-bold rounded-full px-1.5 py-0.5">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gold-400 p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-black border-t border-gold-500/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map(link => (
              <button
                key={link.section}
                onClick={() => handleNav(link.section)}
                className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:text-gold-400 hover:bg-gold-500/10 rounded-md transition-colors duration-300 font-serif"
              >
                {link.label}
              </button>
            ))}
            <Link
              to="/shop"
              className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:text-gold-400 hover:bg-gold-500/10 rounded-md transition-colors duration-300 font-serif"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            {/* Mobile Language Selector */}
            <div className="px-3 py-2 border-t border-gold-500/20 mt-2">
              <div className="flex items-center justify-center space-x-2 text-sm">
                {languages.map((lang, index) => (
                  <React.Fragment key={lang.code}>
                    <button
                      onClick={() => setCurrentLang(lang.code)}
                      className={`px-2 py-1 font-serif transition-colors duration-300 ${
                        currentLang === lang.code 
                          ? 'text-gold-400 font-bold' 
                          : 'text-white hover:text-gold-400'
                      }`}
                    >
                      {lang.name}
                    </button>
                    {index < languages.length - 1 && (
                      <span className="text-gray-500">|</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            {/* Auth links mobile */}
            <div className="px-3 py-2 border-t border-gold-500/20 mt-2 flex flex-col gap-2">
              {user ? (
                <>
                  <span className="text-gold-400 font-serif text-sm">{user.email}</span>
                  <Link to="/profile" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gold-900 transition-colors" title="Profile">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gold-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
                    </svg>
                  </Link>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gold-400 font-serif px-3 py-2 text-sm hover:underline">Login</Link>
                  <Link to="/signup" className="text-gold-400 font-serif px-3 py-2 text-sm hover:underline">Sign Up</Link>
                </>
              )}
            </div>
            {/* Mobile Cart Icon */}
            <div className="flex justify-center py-2">
              <button
                onClick={onCartClick}
                className="relative flex items-center px-3 py-2 text-white hover:text-gold-400 transition-colors"
                aria-label="View cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0l1.7 6.385a2.25 2.25 0 002.183 1.693h7.063a2.25 2.25 0 002.183-1.693l1.7-6.385m-13.216 0h13.216M6.75 21a.75.75 0 100-1.5.75.75 0 000 1.5zm10.5 0a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold-500 text-black text-xs font-bold rounded-full px-1.5 py-0.5">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;