import React from 'react';
import { CheckCircle, Eye, Calculator, Handshake } from 'lucide-react';

const Valuation = () => {
  const steps = [
    {
      icon: <Eye className="text-gold-400" size={32} />,
      title: "Professional Inspection",
      description: "Our certified appraisers examine your items using precision instruments and industry-standard techniques."
    },
    {
      icon: <Calculator className="text-gold-400" size={32} />,
      title: "Market Valuation",
      description: "We calculate fair market value based on current precious metal prices, quality, and condition."
    },
    {
      icon: <Handshake className="text-gold-400" size={32} />,
      title: "Transparent Offer",
      description: "Receive a clear, detailed offer with no hidden fees or obligations. Accept or decline - your choice."
    },
    {
      icon: <CheckCircle className="text-gold-400" size={32} />,
      title: "Instant Payment",
      description: "Upon agreement, receive immediate payment via cash or secure bank transfer."
    }
  ];

  return (
    <section id="valuation" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">
            Valuation <span className="text-gold-400">Process</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-body">
            Transparency and expertise at every step. Understand exactly how we evaluate your precious treasures with certified Antwerp methodology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-black border border-gold-500/20 rounded-lg p-6 text-center hover:border-gold-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/10">
                <div className="mb-4 flex justify-center">
                  {step.icon}
                </div>
                <div className="absolute -top-3 -right-3 bg-gold-500 text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-serif">
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold font-serif text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-300 text-sm font-body leading-relaxed">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-gold-400 to-gold-600"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 border border-gold-500/30 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold font-serif text-white mb-4">
            What We Evaluate
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-gold-400 font-serif font-medium mb-2">Gold Jewelry</div>
              <p className="text-gray-300 text-sm font-body">Rings, necklaces, bracelets, earrings</p>
            </div>
            <div className="text-center">
              <div className="text-gold-400 font-serif font-medium mb-2">Precious Metals</div>
              <p className="text-gray-300 text-sm font-body">Gold, silver, platinum bars & coins</p>
            </div>
            <div className="text-center">
              <div className="text-gold-400 font-serif font-medium mb-2">Diamonds</div>
              <p className="text-gray-300 text-sm font-body">Loose stones & diamond jewelry</p>
            </div>
            <div className="text-center">
              <div className="text-gold-400 font-serif font-medium mb-2">Luxury Watches</div>
              <p className="text-gray-300 text-sm font-body">Rolex, Omega, Cartier & more</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Valuation;