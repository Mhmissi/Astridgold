import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Marie Dubois",
      location: "Brussels",
      rating: 5,
      text: "Sold my grandmother's diamond ring to Astrid Gold. The process was transparent, professional, and I received a fair price. Highly recommended!",
      item: "Diamond Ring"
    },
    {
      name: "Jan Vermeulen",
      location: "Antwerp",
      rating: 5,
      text: "Excellent service for my Rolex Submariner evaluation. The team knew exactly what they were doing and paid immediately. Very trustworthy.",
      item: "Rolex Submariner"
    },
    {
      name: "Sophie Laurent",
      location: "Ghent",
      rating: 5,
      text: "Professional and honest appraisal of my estate jewelry collection. The staff explained everything clearly and made the process stress-free.",
      item: "Estate Jewelry"
    }
  ];

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">
            What Our <span className="text-gold-400">Clients Say</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-body">
            Trusted by hundreds of clients across Belgium for transparent, professional precious metals and luxury goods trading.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-gold-500/20 rounded-lg p-8 hover:border-gold-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/10"
            >
              <div className="flex items-center mb-4">
                <Quote className="text-gold-400 mr-3" size={24} />
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-gold-400 fill-current" size={16} />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-300 font-body leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>
              
              <div className="border-t border-gold-500/20 pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-white font-serif font-bold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm font-body">{testimonial.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gold-400 text-sm font-serif font-medium">{testimonial.item}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 border border-gold-500/30 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold font-serif text-white mb-2">
              Join Our Satisfied Clients
            </h3>
            <p className="text-gray-300 font-body mb-4">
              Experience the Astrid Gold difference - transparent, professional, and trustworthy service.
            </p>
            <button
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-gradient-to-r from-gold-600 to-gold-500 text-black px-6 py-3 rounded-md font-medium font-serif hover:from-gold-500 hover:to-gold-400 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Your Free Valuation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;