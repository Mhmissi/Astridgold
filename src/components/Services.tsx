import React from 'react';
import { Gem, Watch, Star, Scale, Award } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Scale className="text-gold-400" size={32} />,
      title: "Gold & Silver Trading",
      description: "Professional buying and selling of precious metals with competitive market rates and instant cash offers."
    },
    {
      icon: <Gem className="text-gold-400" size={32} />,
      title: "Diamond Valuation",
      description: "Expert diamond assessment using Antwerp's renowned certification standards and international grading."
    },
    {
      icon: <Watch className="text-gold-400" size={32} />,
      title: "Luxury Watch Assessment",
      description: "Specialized evaluation of premium timepieces from Rolex, Patek Philippe, and other luxury brands."
    },
    {
      icon: <Star className="text-gold-400" size={32} />,
      title: "Bespoke Jewelry",
      description: "Custom jewelry design and creation services using your precious metals and stones."
    },
    {
      icon: <Award className="text-gold-400" size={32} />,
      title: "Estate Evaluations",
      description: "Complete estate jewelry and precious metal collections assessment for inheritance and liquidation."
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">
            Our <span className="text-gold-400">Services</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-body">
            Comprehensive precious metals and luxury jewelry services backed by Antwerp's centuries-old expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-black border border-gold-500/20 rounded-lg p-8 hover:border-gold-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/10 hover:-translate-y-2"
            >
              <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold font-serif text-white mb-4 group-hover:text-gold-400 transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-gray-300 font-body leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 border border-gold-500/30 rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold font-serif text-white mb-4">
              Why Choose Astrid Gold?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-gold-400 font-bold font-serif">Certified Appraisers</div>
              </div>
              <div className="text-center">
                <div className="text-gold-400 font-bold font-serif">100% Transparent Process</div>
              </div>
              <div className="text-center">
                <div className="text-gold-400 font-bold font-serif">No-Obligation Guarantee</div>
              </div>
              <div className="text-center">
                <div className="text-gold-400 font-bold font-serif">Instant Cash Offers</div>
              </div>
              <div className="text-center">
                <div className="text-gold-400 font-bold font-serif">Personal Collection</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;