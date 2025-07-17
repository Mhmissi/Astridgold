import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import ImageKit from 'imagekit-javascript';

const imagekit = new ImageKit({
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT
});

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    let imageUrl = '';
    try {
      if (imageFile) {
        // Get authentication parameters from backend
        const authRes = await fetch(import.meta.env.VITE_IMAGEKIT_AUTH_ENDPOINT);
        const auth = await authRes.json();
        // Upload image to ImageKit
        await new Promise((resolve, reject) => {
          imagekit.upload(
            {
              file: imageFile,
              fileName: imageFile.name,
              folder: '/valuations',
              signature: auth.signature,
              expire: auth.expire,
              token: auth.token
            },
            function(err: any, result: any) {
              if (err) reject(err);
              else if (result && result.url) {
                imageUrl = result.url;
                resolve(result.url);
              } else reject(new Error('No result from ImageKit'));
            }
          );
        });
      }
      await addDoc(collection(db, 'valuations'), {
        ...formData,
        imageUrl,
        createdAt: Timestamp.now()
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
      setImageFile(null);
      alert('Thank you for your inquiry! We will contact you soon.');
    } catch (err) {
      alert('Failed to send your message. Please try again.');
    }
    setUploading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">
            Contact <span className="text-gold-400">Us</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-body">
            Ready to get your items appraised? Contact us today for a free, no-obligation valuation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-gray-900 border border-gold-500/20 rounded-lg p-8">
            <h3 className="text-2xl font-bold font-serif text-white mb-6">
              Request a Free Valuation
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gold-400 mb-2 font-serif">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-gold-500/30 rounded-md text-white placeholder-gray-400 focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors duration-300 font-body"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gold-400 mb-2 font-serif">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-gold-500/30 rounded-md text-white placeholder-gray-400 focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors duration-300 font-body"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gold-400 mb-2 font-serif">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-gold-500/30 rounded-md text-white placeholder-gray-400 focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors duration-300 font-body"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gold-400 mb-2 font-serif">
                  Tell us about your items *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-gold-500/30 rounded-md text-white placeholder-gray-400 focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors duration-300 font-body resize-none"
                  placeholder="Describe the items you'd like appraised..."
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gold-400 mb-2 font-serif">
                  Upload an image (optional)
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full px-4 py-2 bg-black border border-gold-500/30 rounded-md text-white file:bg-gold-500 file:text-black file:font-bold file:rounded file:px-4 file:py-2"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-gold-600 to-gold-500 text-black px-6 py-3 rounded-md text-lg font-medium font-serif hover:from-gold-500 hover:to-gold-400 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-60"
                disabled={uploading}
              >
                <span>{uploading ? 'Sending...' : 'Send Message'}</span>
                <Send size={20} />
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-gray-900 border border-gold-500/20 rounded-lg p-8">
              <h3 className="text-2xl font-bold font-serif text-white mb-6">
                Visit or Call Us
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="text-gold-400 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="text-lg font-bold font-serif text-white mb-1">Address</h4>
                    <p className="text-gray-300 font-body">
                      Koningin Astridplein 31<br />
                      Antwerp, Belgium
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="text-gold-400 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="text-lg font-bold font-serif text-white mb-1">Phone</h4>
                    <a 
                      href="tel:+32490259005" 
                      className="text-gold-400 hover:text-gold-300 transition-colors duration-300 font-body"
                    >
                      +32 490 25 90 05
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="text-gold-400 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="text-lg font-bold font-serif text-white mb-1">Email</h4>
                    <a 
                      href="mailto:info@astridgold.be" 
                      className="text-gold-400 hover:text-gold-300 transition-colors duration-300 font-body"
                    >
                      info@astridgold.be
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="text-gold-400 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="text-lg font-bold font-serif text-white mb-1">Hours</h4>
                    <div className="text-gray-300 font-body">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 10:00 AM - 4:00 PM</p>
                      <p>Sunday: By appointment only</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-gray-900 border border-gold-500/20 rounded-lg p-8">
              <h3 className="text-xl font-bold font-serif text-white mb-4">Find Us</h3>
              <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-400 font-body">
                  Interactive map would be embedded here<br />
                  (Google Maps integration)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;