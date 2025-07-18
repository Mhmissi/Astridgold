import React, { useEffect, useState } from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';

const OUNCE_TO_GRAM = 31.1035;

const Hero = () => {
  const [goldPrice, setGoldPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceChange, setPriceChange] = useState<number | null>(null);

  useEffect(() => {
    const fetchGoldPrice = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('https://www.goldapi.io/api/XAU/EUR', {
          headers: {
            'x-access-token': 'goldapi-5wcsmd9ej5n4-io',
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) throw new Error('Failed to fetch gold price');
        const data = await res.json();
        // data.price is per ounce
        const pricePerGram = data.price / OUNCE_TO_GRAM;
        setGoldPrice(pricePerGram);
        // data.ch is the price change
        setPriceChange(data.ch);
      } catch (err: any) {
        setError('Could not load gold price.');
      } finally {
        setLoading(false);
      }
    };
    fetchGoldPrice();
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://ik.imagekit.io/by733ltn6/Astrid%20Gold%20logo%20%20whait/gold-stock-market-investment-financial-income-cash-flow-financial-success%20(1).jpg?updatedAt=1751244186469')`
          }}
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center pt-24 pb-12 px-4">
        {/* Title and Subtitle */}
        <h1 className="text-5xl md:text-7xl font-bold font-serif text-gold-400 mb-6 leading-tight drop-shadow-2xl text-center">
          Astrid Gold
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed font-body drop-shadow-lg text-center">
          Antwerp's premier precious metals and luxury jewelry buy/sell. Where heritage meets modern convenience.
        </p>

        {/* Live Gold Price Card */}
        <div className="bg-black/80 border border-gold-500 rounded-lg shadow-lg px-8 py-6 mb-8 max-w-md w-full mx-auto flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-gold-400" size={22} />
            <span className="text-gold-400 font-bold font-serif text-lg">Live Gold Price</span>
          </div>
          {loading ? (
            <div className="text-white text-xl">Loading...</div>
          ) : error ? (
            <div className="text-red-400 text-lg">{error}</div>
          ) : (
            <>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                €{goldPrice?.toFixed(2)}<small className='text-lg font-normal text-gray-300'>/gram</small>
              </div>
              <div className={`text-lg font-semibold ${priceChange && priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {priceChange && priceChange >= 0 ? '+' : ''}{priceChange?.toFixed(2)} today
              </div>
            </>
          )}
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-center">
          <a
            href="#valuation"
            className="bg-gold-400 hover:bg-gold-500 text-black font-bold font-serif px-8 py-4 rounded-lg text-lg shadow-lg flex items-center gap-2 transition-colors duration-200"
          >
            Get a Free Valuation <ArrowRight size={22} />
          </a>
          <a
            href="tel:+32490259005"
            className="border border-gold-400 text-gold-400 hover:bg-gold-500 hover:text-black font-bold font-serif px-8 py-4 rounded-lg text-lg shadow-lg flex items-center transition-colors duration-200"
          >
            Call Now: +32 490 25 90 05
          </a>
        </div>

        {/* Stats Section */}
        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="bg-black/80 border border-gold-500 rounded-lg p-6 flex flex-col items-center">
            <div className="text-3xl font-bold text-gold-400 mb-2">25+</div>
            <div className="text-white font-serif text-lg">Years Experience</div>
          </div>
          <div className="bg-black/80 border border-gold-500 rounded-lg p-6 flex flex-col items-center">
            <div className="text-3xl font-bold text-gold-400 mb-2">100%</div>
            <div className="text-white font-serif text-lg">Transparent Process</div>
          </div>
          <div className="bg-black/80 border border-gold-500 rounded-lg p-6 flex flex-col items-center">
            <div className="text-3xl font-bold text-gold-400 mb-2">€5M+</div>
            <div className="text-white font-serif text-lg">Valuations Completed</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;