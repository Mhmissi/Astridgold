import React from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://ik.imagekit.io/by733ltn6/Astrid%20Gold%20logo%20%20whait/gold-stock-market-investment-financial-income-cash-flow-financial-success%20(1).jpg?updatedAt=1751244186469')`
          }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/70"></div>
        {/* Gradient overlay for enhanced contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
      </div>

      {/* Fallback background in case image fails to load */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black -z-10"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Removed logo image */}
        <h1 className="text-5xl md:text-7xl font-bold font-serif text-white mb-6 leading-tight drop-shadow-2xl">
          <span className="bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent drop-shadow-lg">
            Astrid Gold
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed font-body drop-shadow-lg">
          Antwerp's premier precious metals and luxury jewelry buy/sell. Where heritage meets modern convenience.
        </p>
        {/* Removed live gold price, valuation button, call now, and stats */}
      </div>
    </section>
  );
};

export default Hero;