import React from 'react';
import { MapPin, Shield, Clock } from 'lucide-react';
import AttractImages from './AttractImages';

const About = () => {
  return (
    <section id="about" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-6">
              Our <span className="text-gold-400">Story</span>
            </h2>
            <p className="text-lg text-gray-300 mb-6 font-body leading-relaxed">
              With years of experience in precious metals and fine jewelry, Astrid Gold blends Antwerp's historic trade roots with a modern approach to transparency and trust.
            </p>
            <p className="text-lg text-gray-300 mb-8 font-body leading-relaxed">
              Located in the heart of Antwerp, we serve clients from across Belgium and Europe, continuing the city's legendary tradition of diamond and precious metal excellence.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <MapPin className="text-gold-400" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif text-white mb-2">Prime Antwerp Location</h3>
                  <p className="text-gray-300 font-body">Strategically positioned in Antwerp's prestigious district, easily accessible for international clients.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Shield className="text-gold-400" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif text-white mb-2">Certified Expertise</h3>
                  <p className="text-gray-300 font-body">Our appraisers are certified by international gemological institutes and precious metals associations.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Clock className="text-gold-400" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif text-white mb-2">Heritage & Innovation</h3>
                  <p className="text-gray-300 font-body">Combining centuries-old Antwerp trading traditions with modern technology and transparent practices.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Section */}
          <div className="relative">
            <div className="relative z-10 bg-gradient-to-br from-gold-500/20 to-gold-600/20 backdrop-blur-sm border border-gold-500/30 rounded-lg p-8">
              {/* Replace static image with AttractImages carousel */}
              <div className="mb-6">
                <AttractImages />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold font-serif text-white mb-4">Visit Our Showroom</h3>
                <p className="text-gray-300 font-body mb-4">
                  Experience our collection and meet with our certified appraisers in a comfortable, professional environment.
                </p>
                <div className="bg-gold-500/10 border border-gold-500/30 rounded-lg p-4">
                  <p className="text-gold-400 font-serif font-medium">Koningin Astridplein 31, Antwerp</p>
                  <p className="text-white font-body">By appointment or walk-in</p>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-gold-500 to-gold-700 rounded-full opacity-15 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;