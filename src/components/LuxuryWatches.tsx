import React from 'react';
import { Watch, Gem, Shield, Clock, Award, Star } from 'lucide-react';

const LuxuryWatches = () => {
  const watchBrands = [
    'Rolex', 'Patek Philippe', 'Audemars Piguet', 'Omega', 'Cartier', 'Breitling',
    'TAG Heuer', 'IWC', 'Jaeger-LeCoultre', 'Vacheron Constantin', 'Panerai', 'Tudor'
  ];

  const diamondTypes = [
    'Certified loose diamonds',
    'Diamond rings & engagement rings',
    'Diamond necklaces & pendants',
    'Diamond earrings',
    'Unset diamonds (with or without certificates)',
    'Estate diamond jewelry'
  ];

  return (
    <section id="luxury" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">
            Luxury <span className="text-gold-400">Watches & Diamonds</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-body">
            Specializing in high-end timepieces and certified diamonds. Get top market rates with our expert Antwerp appraisals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* Luxury Watches Section */}
          <div className="bg-black border border-gold-500/20 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <Watch className="text-gold-400 mr-4" size={32} />
              <h3 className="text-2xl font-bold font-serif text-white">Premium Timepieces</h3>
            </div>
            
            <p className="text-gray-300 font-body mb-6 leading-relaxed">
              Whether you own a vintage Rolex, modern Patek Philippe, or any luxury timepiece, 
              our certified horologists provide accurate valuations based on current market conditions.
            </p>

            <div className="mb-6">
              <h4 className="text-lg font-bold font-serif text-gold-400 mb-3">Brands We Specialize In:</h4>
              <div className="grid grid-cols-2 gap-2">
                {watchBrands.map((brand, index) => (
                  <div key={index} className="text-gray-300 font-body text-sm">
                    • {brand}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Clock className="text-gold-400 mr-2" size={20} />
                <span className="text-gold-400 font-serif font-medium">Same-Day Evaluation</span>
              </div>
              <p className="text-gray-300 text-sm font-body">
                Bring your timepiece for immediate professional assessment and instant cash offer.
              </p>
            </div>
          </div>

          {/* Diamonds Section */}
          <div className="bg-black border border-gold-500/20 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <Gem className="text-gold-400 mr-4" size={32} />
              <h3 className="text-2xl font-bold font-serif text-white">Certified Diamonds</h3>
            </div>
            
            <p className="text-gray-300 font-body mb-6 leading-relaxed">
              From loose stones to complete jewelry pieces, our diamond experts use Antwerp's 
              world-renowned grading standards to ensure accurate, fair valuations.
            </p>

            <div className="mb-6">
              <h4 className="text-lg font-bold font-serif text-gold-400 mb-3">What We Evaluate:</h4>
              <div className="space-y-2">
                {diamondTypes.map((type, index) => (
                  <div key={index} className="text-gray-300 font-body text-sm">
                    • {type}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Shield className="text-gold-400 mr-2" size={20} />
                <span className="text-gold-400 font-serif font-medium">Certified Appraisal</span>
              </div>
              <p className="text-gray-300 text-sm font-body">
                All diamonds evaluated using international certification standards (GIA, HRD, etc.).
              </p>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 border border-gold-500/30 rounded-lg p-8 mb-16">
          <h3 className="text-2xl font-bold font-serif text-white mb-6 text-center">
            Our Luxury Evaluation Process
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-gold-500 text-black w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold font-serif mx-auto mb-3">1</div>
              <h4 className="text-gold-400 font-serif font-medium mb-2">Authentication</h4>
              <p className="text-gray-300 text-sm font-body">Verify authenticity using specialized equipment</p>
            </div>
            <div className="text-center">
              <div className="bg-gold-500 text-black w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold font-serif mx-auto mb-3">2</div>
              <h4 className="text-gold-400 font-serif font-medium mb-2">Condition Assessment</h4>
              <p className="text-gray-300 text-sm font-body">Detailed evaluation of condition and functionality</p>
            </div>
            <div className="text-center">
              <div className="bg-gold-500 text-black w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold font-serif mx-auto mb-3">3</div>
              <h4 className="text-gold-400 font-serif font-medium mb-2">Market Valuation</h4>
              <p className="text-gray-300 text-sm font-body">Current market analysis and pricing</p>
            </div>
            <div className="text-center">
              <div className="bg-gold-500 text-black w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold font-serif mx-auto mb-3">4</div>
              <h4 className="text-gold-400 font-serif font-medium mb-2">Instant Offer</h4>
              <p className="text-gray-300 text-sm font-body">Transparent offer with immediate payment option</p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-black border border-gold-500/20 rounded-lg p-6 text-center hover:border-gold-400/50 transition-all duration-300">
            <Award className="text-gold-400 mx-auto mb-3" size={32} />
            <h4 className="text-white font-serif font-bold mb-2">Certified Appraisers</h4>
            <p className="text-gray-300 text-sm font-body">International certification</p>
          </div>
          <div className="bg-black border border-gold-500/20 rounded-lg p-6 text-center hover:border-gold-400/50 transition-all duration-300">
            <Shield className="text-gold-400 mx-auto mb-3" size={32} />
            <h4 className="text-white font-serif font-bold mb-2">Instant Cash</h4>
            <p className="text-gray-300 text-sm font-body">Same-day payment</p>
          </div>
          <div className="bg-black border border-gold-500/20 rounded-lg p-6 text-center hover:border-gold-400/50 transition-all duration-300">
            <Star className="text-gold-400 mx-auto mb-3" size={32} />
            <h4 className="text-white font-serif font-bold mb-2">No Obligation</h4>
            <p className="text-gray-300 text-sm font-body">Free evaluation</p>
          </div>
          <div className="bg-black border border-gold-500/20 rounded-lg p-6 text-center hover:border-gold-400/50 transition-all duration-300">
            <Clock className="text-gold-400 mx-auto mb-3" size={32} />
            <h4 className="text-white font-serif font-bold mb-2">Confidential</h4>
            <p className="text-gray-300 text-sm font-body">Secure & private</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LuxuryWatches;