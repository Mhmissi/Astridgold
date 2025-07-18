import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Product } from './Shop';
import { Link } from 'react-router-dom';

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const snap = await getDocs(collection(db, 'products'));
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) } as Product)));
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (loading) return null;
  if (products.length === 0) return null;

  // Hot Deals: up to 4 discounted products
  const hotDeals = products.filter(p => p.discountPercent && p.discountPercent > 0).slice(0, 4);
  const featured = products.filter(p => !p.discountPercent || p.discountPercent === 0).slice(0, 4);

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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
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
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold font-serif text-gold-400 mb-2 truncate">{product.name}</h3>
                        <p className="text-gold-100 font-body mb-2 text-base">{product.description?.slice(0, 60)}{product.description && product.description.length > 60 ? '...' : ''}</p>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          {origPrice ? (
                            <>
                              <span className="line-through text-red-400 mr-2">${origPrice}</span>
                              <span className="text-gold-400 font-bold">${discountedPrice}</span>
                            </>
                          ) : (
                            <span className="text-gold-400 font-serif">Contact for Price</span>
                          )}
                        </div>
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
        <div>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">
              Featured <span className="text-gold-400">Products</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-body">
              Discover our most sought-after pieces, handpicked for their beauty and value.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {featured.map(product => {
              const origPrice = getDisplayPrice(product);
              return (
                <div key={product.id} className="bg-black border border-gold-500 rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-200">
                  <div className="relative group">
                    <img
                      src={product.images && product.images.length > 0 ? product.images[0] : product.mainImage}
                      alt={product.name}
                      className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold font-serif text-gold-400 mb-2 truncate">{product.name}</h3>
                      <p className="text-gold-100 font-body mb-2 text-base">{product.description?.slice(0, 60)}{product.description && product.description.length > 60 ? '...' : ''}</p>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xl font-bold text-gold-500 font-serif">{origPrice ? `$${origPrice}` : <span className='text-gold-400 font-serif'>Contact for Price</span>}</span>
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
      </div>
    </section>
  );
};

export default FeaturedProducts; 