import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gold-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <img 
              src="https://ik.imagekit.io/by733ltn6/Astrid%20Gold%20logo%20%20whait/astrid%20logo%20%20gold%20black.png?updatedAt=1750789116389"
              alt="Astrid Gold"
              className="h-12 mb-4 filter brightness-0 invert"
            />
            <p className="text-gray-300 font-body leading-relaxed">
              Antwerp's premier destination for precious metals and luxury jewelry trading. 
              Where heritage meets modern convenience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold font-serif text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-300 hover:text-gold-400 transition-colors duration-300 font-body">
                  Home
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-300 hover:text-gold-400 transition-colors duration-300 font-body">
                  Services
                </a>
              </li>
              <li>
                <a href="#luxury" className="text-gray-300 hover:text-gold-400 transition-colors duration-300 font-body">
                  Luxury Watches & Diamonds
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-gold-400 transition-colors duration-300 font-body">
                  About Us
                </a>
              </li>
              <li>
                <a href="#valuation" className="text-gray-300 hover:text-gold-400 transition-colors duration-300 font-body">
                  Valuation Process
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-gold-400 transition-colors duration-300 font-body">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold font-serif text-white mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="text-gold-400" size={16} />
                <span className="text-gray-300 font-body">Koningin Astridplein 31, Antwerp</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-gold-400" size={16} />
                <a 
                  href="tel:+32490259005" 
                  className="text-gray-300 hover:text-gold-400 transition-colors duration-300 font-body"
                >
                  +32 490 25 90 05
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-gold-400" size={16} />
                <a 
                  href="mailto:info@astridgold.be" 
                  className="text-gray-300 hover:text-gold-400 transition-colors duration-300 font-body"
                >
                  info@astridgold.be
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gold-500/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 font-body text-sm">
              © 2025 Astrid Gold · All rights reserved · info@astridgold.be · +32 490 25 90 05
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors duration-300 font-body text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors duration-300 font-body text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;