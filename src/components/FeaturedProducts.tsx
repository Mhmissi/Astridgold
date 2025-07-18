import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Product } from './Shop';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [specialEditions, setSpecialEditions] = useState<any[]>([]);
  const [currentMobile, setCurrentMobile] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      const snap = await getDocs(collection(db, 'products'));
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) } as Product)));
      // Fetch special editions
      const specialSnap = await getDocs(collection(db, 'specialEditions'));
      setSpecialEditions(specialSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (loading) return null;
  if (products.length === 0) return null;

  // Merge specialEditions into the main product list for display
  const allProducts = [
    ...products,
    ...specialEditions.map(s => ({ ...s, isSpecialEdition: true }))
  ];

  // Hot Deals: up to 4 discounted products
  const hotDeals = allProducts.filter(p => p.discountPercent && p.discountPercent > 0).slice(0, 4);
  if (hotDeals.length === 0) return null;

  const getDisplayPrice = (product: Product) => {
    // Try to get the first valid carat price
    if (product.prices && typeof product.prices === 'object') {
      for (const key of Object.keys(product.prices)) {
        const price = Number((product.prices[key] || '').replace(/[^\d.]/g, ''));
        if (price > 0) return price;
      }
    }
    // Try main price
    const mainPrice = Number((product.price || '').replace(/[^\d.]/g, ''));
    if (mainPrice > 0) return mainPrice;
    // Fallback
    return null;
  };

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hot Deals section */}
        {hotDeals.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">
                Hot <span className="text-red-500">Deals</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto font-body">
                Don’t miss these limited-time offers on our most stunning pieces.
              </p>
            </div>
            {/* Mobile slider */}
            <div className="block md:hidden">
              <div className="relative w-full flex items-center justify-center">
                <button
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full z-10"
                  onClick={() => setCurrentMobile((prev) => (prev === 0 ? hotDeals.length - 1 : prev - 1))}
                  aria-label="Previous"
                >
                  <ChevronLeft className="text-gold-400" size={28} />
                </button>
                <div className="w-full">
                  {(() => {
                    const product = hotDeals[currentMobile];
                    if (!product) return null;
                    const origPrice = getDisplayPrice(product);
                    const discount = product.discountPercent || 0;
                    const discountedPrice = origPrice && discount > 0 ? Math.round(origPrice * (1 - discount / 100)) : origPrice;
                    return (
                      <div className="flex justify-center">
                        {/* Only show the current product */}
                        <div className="bg-black border border-gold-500 rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-200 w-full max-w-xs mx-auto">
                          <div className="relative group">
                            <img
                              src={product.images && product.images.length > 0 ? product.images[0] : product.mainImage}
                              alt={product.name}
                              className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            {product.discountPercent && product.discountPercent > 0 && (
                              <span className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">-{product.discountPercent}%</span>
                            )}
                            {product.isSpecialEdition && (
                              <span className="absolute top-2 right-2 bg-gold-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg z-20">Special Edition</span>
                            )}
                          </div>
                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="text-lg font-bold font-serif text-gold-400 mb-2 truncate">{product.name}</h3>
                              <p className="text-gold-100 font-body mb-2 text-base">{product.description?.slice(0, 60)}{product.description && product.description.length > 60 ? '...' : ''}</p>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-xl font-bold text-gold-500 font-serif">{discountedPrice ? `$${discountedPrice}` : <span className='text-gold-400 font-serif'>Contact for Price</span>}</span>
                              <Link
                                to="/shop"
                                className="bg-gradient-to-r from-gold-600 to-gold-500 text-black px-4 py-2 rounded font-bold font-serif hover:from-gold-500 hover:to-gold-400 transition-all duration-300 shadow hover:shadow-lg"
                              >
                                Shop Now
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full z-10"
                  onClick={() => setCurrentMobile((prev) => (prev === hotDeals.length - 1 ? 0 : prev + 1))}
                  aria-label="Next"
                >
                  <ChevronRight className="text-gold-400" size={28} />
                </button>
              </div>
              {/* Dots navigation */}
              <div className="flex justify-center mt-4 gap-2">
                {hotDeals.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-3 h-3 rounded-full ${idx === currentMobile ? 'bg-gold-400' : 'bg-gray-700'}`}
                    onClick={() => setCurrentMobile(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
            {/* Desktop grid */}
            <div className="hidden md:grid grid-cols-4 gap-8">
              {hotDeals.map(product => {
                const origPrice = getDisplayPrice(product);
                const discount = product.discountPercent || 0;
                const discountedPrice = origPrice && discount > 0 ? Math.round(origPrice * (1 - discount / 100)) : origPrice;
                return (
                  <div key={product.id} className="bg-black border border-gold-500 rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-200">
                    <div className="relative group">
                      <img
                        src={product.images && product.images.length > 0 ? product.images[0] : product.mainImage}
                        alt={product.name}
                        className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      {discount > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">-{discount}%</span>
                      )}
                      {product.isSpecialEdition && (
                        <span className="absolute top-2 right-2 bg-gold-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg z-20">Special Edition</span>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold font-serif text-gold-400 mb-2 truncate">{product.name}</h3>
                        <p className="text-gold-100 font-body mb-2 text-base">{product.description?.slice(0, 60)}{product.description && product.description.length > 60 ? '...' : ''}</p>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xl font-bold text-gold-500 font-serif">{discountedPrice ? `$${discountedPrice}` : <span className='text-gold-400 font-serif'>Contact for Price</span>}</span>
                        <Link
                          to="/shop"
                          className="bg-gradient-to-r from-gold-600 to-gold-500 text-black px-4 py-2 rounded font-bold font-serif hover:from-gold-500 hover:to-gold-400 transition-all duration-300 shadow hover:shadow-lg"
                        >
                          Shop Now
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts; 