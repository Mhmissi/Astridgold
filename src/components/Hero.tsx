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
        <div className="mb-8">
          <img 
            src="https://ik.imagekit.io/by733ltn6/Astrid%20Gold%20logo%20%20whait/astrid%20logo%20%20gold%20black.png?updatedAt=1750789116389"
            alt="Astrid Gold"
            className="h-20 mx-auto mb-8 filter brightness-0 invert drop-shadow-lg"
          />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold font-serif text-white mb-6 leading-tight drop-shadow-2xl">
          <span className="bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent drop-shadow-lg">
            Astrid Gold
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed font-body drop-shadow-lg">
          Antwerp's premier precious metals and luxury jewelry buy/sell. Where heritage meets modern convenience.
        </p>

        {/* Live Gold Price Widget */}
        <div className="bg-black/60 backdrop-blur-md border border-gold-500/40 rounded-lg p-6 mb-12 max-w-md mx-auto shadow-2xl">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <TrendingUp className="text-gold-400" size={20} />
            <span className="text-gold-400 font-serif font-medium">Live Gold Price</span>
          </div>
          <div className="text-2xl font-bold text-white font-serif">
            €58.42<span className="text-sm text-gray-300">/gram</span>
          </div>
          <div className="text-sm text-green-400 mt-1">+1.2% today</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={scrollToContact}
            className="group bg-gradient-to-r from-gold-600 to-gold-500 text-black px-8 py-4 rounded-md text-lg font-medium font-serif hover:from-gold-500 hover:to-gold-400 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center space-x-2"
          >
            <span>Get a Free Valuation</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          
          <a
            href="tel:+32490259005"
            className="text-white border border-gold-500/80 bg-black/40 backdrop-blur-sm px-8 py-4 rounded-md text-lg font-medium font-serif hover:bg-gold-500 hover:text-black hover:border-gold-400 transition-all duration-300 hover:shadow-xl"
          >
            Call Now: +32 490 25 90 05
          </a>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-gold-500/20">
            <div className="text-3xl font-bold text-gold-400 font-serif">25+</div>
            <div className="text-white font-body">Years Experience</div>
          </div>
          <div className="text-center bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-gold-500/20">
            <div className="text-3xl font-bold text-gold-400 font-serif">100%</div>
            <div className="text-white font-body">Transparent Process</div>
          </div>
          <div className="text-center bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-gold-500/20">
            <div className="text-3xl font-bold text-gold-400 font-serif">€5M+</div>
            <div className="text-white font-body">Valuations Completed</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;