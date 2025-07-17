import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import LuxuryWatches from './components/LuxuryWatches';
import About from './components/About';
import Valuation from './components/Valuation';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Shop from './components/Shop';
import CartDrawer from './components/CartDrawer';
import Admin from './components/Admin';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './components/Login';
import SignUp from './components/SignUp';
import PasswordReset from './components/PasswordReset';
import UserProfile from './components/UserProfile';
import OrderHistory from './components/OrderHistory';
import { db } from './firebase';
import { doc, getDoc, addDoc, collection, Timestamp, getDocs } from 'firebase/firestore';
import { Product } from './components/Shop';

function ScrollToSectionOnHome() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === '/' && location.state && location.state.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100); // wait for render
      }
    }
  }, [location]);
  return null;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center min-h-screen text-gold-400 text-xl">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  useEffect(() => {
    if (!user) return;
    setIsAdmin(null);
    getDoc(doc(db, 'users', user.uid)).then(snap => {
      setIsAdmin(snap.exists() && snap.data().role === 'admin');
    });
  }, [user]);
  if (loading || isAdmin === null) return <div className="flex justify-center items-center min-h-screen text-gold-400 text-xl">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <div className="flex justify-center items-center min-h-screen text-red-400 text-xl">Not authorized</div>;
  return <>{children}</>;
}

function App() {
  // Cart state: array of Product
  const [cart, setCart] = useState<Product[]>(() => {
    // Load from localStorage if available
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, loading } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    // Fetch first 4 products for home page
    const fetchFeatured = async () => {
      const snap = await getDocs(collection(db, 'products'));
      setFeaturedProducts(snap.docs.slice(0, 4).map(doc => ({ ...doc.data(), id: doc.id } as Product)));
    };
    fetchFeatured();
  }, []);

  const handleAddToCart = (product: Product) => {
    setCart((prev: Product[]) => [...prev, product]);
  };
  const handleRemoveFromCart = (productId: number | string) => {
    setCart((prev: Product[]) => prev.filter((item: Product) => item.id !== productId));
  };

  const handleCheckout = async () => {
    if (loading) return; // Wait for auth to load
    if (!user) {
      window.location.href = '/login';
      return;
    }
    if (cart.length === 0) return;
    const order = {
      userId: user.uid,
      total: cart.reduce((sum: number, item: Product) => sum + Number(item.price.replace(/[^\d.]/g, '')), 0),
      status: 'Pending',
      createdAt: Timestamp.now(),
      items: cart.map((item: Product) => ({
        name: item.name,
        carat: (item.carats && item.carats[0]) || '',
        metal: item.ringMetal,
        qty: 1,
        price: Number(item.price.replace(/[^\d.]/g, ''))
      }))
    };
    try {
      await addDoc(collection(db, 'orders'), order);
      setCart([]);
      alert('Order placed successfully!');
      setIsCartOpen(false);
    } catch (err) {
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <Router>
      <ScrollToSectionOnHome />
      <div className="min-h-screen bg-black text-white">
        <Header cartCount={cart.length} onCartClick={() => setIsCartOpen(true)} />
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onRemove={handleRemoveFromCart}
          onCheckout={handleCheckout}
          // Disable checkout if loading
          disabled={loading}
        />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Services />
                {/* Featured Products Section */}
                <section className="py-16 bg-black">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold font-serif text-gold-400 mb-8 text-center">Featured Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                      {featuredProducts.map(product => (
                        <div key={product.id} className="bg-gray-900 rounded-xl shadow-lg overflow-hidden flex flex-col border-2 border-gold-900 hover:border-gold-500 transition-all duration-200">
                          <img src={product.mainImage} alt={product.name} className="h-48 w-full object-cover" />
                          <div className="p-4 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold font-serif text-gold-400 mb-2">{product.name}</h3>
                            <p className="text-white font-body mb-2">{product.description}</p>
                            <div className="mt-auto">
                              <span className="text-gold-400 font-bold text-lg">{product.price}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={() => navigate('/shop')}
                        className="bg-gold-500 text-black px-8 py-3 rounded font-bold text-lg hover:bg-gold-600 transition-colors shadow-lg"
                      >
                        See More
                      </button>
                    </div>
                  </div>
                </section>
                {/* Remove or comment out the following: LuxuryWatches, About, Valuation, Testimonials, Contact */}
                {/* <LuxuryWatches />
                <About />
                <Valuation />
                <Testimonials />
                <Contact /> */}
                <Footer />
              </>
            }
          />
          <Route
            path="/shop"
            element={
              <Shop
                cart={cart}
                onAddToCart={handleAddToCart}
              />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;