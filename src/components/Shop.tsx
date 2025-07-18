import React, { useState, useEffect } from "react";
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export interface Product {
  id: number;
  name: string;
  price: string;
  mainImage: string;
  description?: string;
  diamondShape: string;
  ringDesign: string;
  ringMetal: string;
  carats: string[];
  images?: string[]; // Added images property
  prices?: { [carat: string]: string }; // Added prices property
  discountPercent?: number; // Added discountPercent property
}

const diamondShapes = [
  "Round Brilliant Cut",
  "Princess Cut (Square)",
  "Emerald Cut (Rectangular)",
  "Oval Brilliant Cut"
];
const ringDesigns = [
  "Classic Solitaire",
  "Halo Setting",
  "Vintage/Antique Style",
  "Three Stone (Trinity)"
];
const ringMetals = [
  "White Gold (14K/18K)",
  "Yellow Gold (14K/18K)",
  "Rose Gold (14K/18K)",
  "Platinum (950)"
];
const carats = ["1.0 Carat", "1.5 Carat", "2.0 Carat", "2.5 Carat"];

interface ShopProps {
  cart: Product[];
  onAddToCart: (product: Product) => void;
}

const Shop: React.FC<ShopProps> = ({ cart, onAddToCart }) => {
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  const [selectedMetal, setSelectedMetal] = useState<string | null>(null);
  const [selectedCarat, setSelectedCarat] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [caratSelections, setCaratSelections] = useState<{ [id: string]: string }>({});
  const [modalCarat, setModalCarat] = useState<string>("");
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [metalSelections, setMetalSelections] = useState<{ [id: string]: string }>({});
  const [modalMetal, setModalMetal] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<'low' | 'high'>('low');
  const [showDiscountedOnly, setShowDiscountedOnly] = useState(false);
  const [showSpecialEditionsOnly, setShowSpecialEditionsOnly] = useState(false);
  const [specialEditions, setSpecialEditions] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      // Fetch special editions
      const specialSnap = await getDocs(collection(db, 'specialEditions'));
      setSpecialEditions(specialSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProducts();
  }, []);

  const clearAllFilters = () => {
    setSelectedShape(null);
    setSelectedDesign(null);
    setSelectedMetal(null);
    setSelectedCarat(null);
    setSearch("");
    setShowDiscountedOnly(false);
    setShowSpecialEditionsOnly(false);
  };

  // Remove the separate Special Editions section
  // Merge specialEditions into the main product list for display
  const allProducts = [...products, ...specialEditions.map(s => ({ ...s, isSpecialEdition: true }))];

  const filteredProducts = allProducts.filter((product) => {
    const matchesShape = !selectedShape || product.diamondShape === selectedShape;
    const matchesDesign = !selectedDesign || product.ringDesign === selectedDesign;
    const matchesMetal = !selectedMetal || product.ringMetal === selectedMetal;
    const matchesCarat = !selectedCarat || product.carats.includes(selectedCarat);
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    if (showDiscountedOnly && !(product.discountPercent && product.discountPercent > 0)) return false;
    if (showSpecialEditionsOnly && !product.isSpecialEdition) return false;
    return matchesShape && matchesDesign && matchesMetal && matchesCarat && matchesSearch;
  });

  const getComparablePrice = (product: Product, order: 'low' | 'high') => {
    if (product.prices && typeof product.prices === 'object') {
      const priceValues = Object.values(product.prices).map(p => Number((p || '').replace(/[^\d.]/g, '')));
      if (priceValues.length > 0) {
        return order === 'low' ? Math.min(...priceValues) : Math.max(...priceValues);
      }
    }
    return Number((product.price || '').replace(/[^\d.]/g, ''));
  };

  const getDiscountedCaratPrice = (product: Product, carat: string) => {
    const orig = Number((product.prices && product.prices[carat] ? product.prices[carat] : product.price || '').replace(/[^\d.]/g, ''));
    const discount = product.discountPercent || 0;
    return discount > 0 ? Math.round(orig * (1 - discount / 100)) : orig;
  };

  const getDisplayPrice = (product: Product, carat: string) => {
    // Try to get a valid carat price
    if (product.prices && carat && product.prices[carat]) {
      const price = Number((product.prices[carat] || '').replace(/[^\d.]/g, ''));
      if (price > 0) return price;
    }
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

  // Remove any grouping or type-based filtering before sorting
  const sortedProducts = [...products].sort((a, b) => {
    const priceA = getComparablePrice(a, sortOrder);
    const priceB = getComparablePrice(b, sortOrder);
    return sortOrder === 'low' ? priceA - priceB : priceB - priceA;
  });

  // Add a mapping for metal colors
  const metalColors: { [metal: string]: string } = {
    "White Gold (14K/18K)": "bg-gray-300 border-gray-400",
    "Yellow Gold (14K/18K)": "bg-yellow-400 border-yellow-500",
    "Rose Gold (14K/18K)": "bg-rose-300 border-rose-400",
    "Platinum (950)": "bg-gray-500 border-gray-600"
  };

  return (
    <div className="min-h-screen bg-black text-white py-10 px-4 font-serif">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gold-400">Shop</h1>
        {/* Top Filter Bar */}
        <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center flex-1">
            <select
              value={selectedShape || ''}
              onChange={e => setSelectedShape(e.target.value || null)}
              className="bg-black text-gold-400 border border-gold-400 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
            >
              <option value="">Diamond Shape</option>
              {diamondShapes.map(shape => (
                <option key={shape} value={shape}>{shape}</option>
              ))}
            </select>
            <select
              value={selectedDesign || ''}
              onChange={e => setSelectedDesign(e.target.value || null)}
              className="bg-black text-gold-400 border border-gold-400 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
            >
              <option value="">Ring Design</option>
              {ringDesigns.map(design => (
                <option key={design} value={design}>{design}</option>
              ))}
            </select>
            <select
              value={selectedMetal || ''}
              onChange={e => setSelectedMetal(e.target.value || null)}
              className="bg-black text-gold-400 border border-gold-400 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
            >
              <option value="">Ring Metal</option>
              {ringMetals.map(metal => (
                <option key={metal} value={metal}>{metal}</option>
              ))}
            </select>
            <select
              value={selectedCarat || ''}
              onChange={e => setSelectedCarat(e.target.value || null)}
              className="bg-black text-gold-400 border border-gold-400 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
            >
              <option value="">Carat</option>
              {carats.map(carat => (
                <option key={carat} value={carat}>{carat}</option>
              ))}
            </select>
            <button
              className="text-gold-400 underline text-sm ml-2"
              onClick={clearAllFilters}
            >
              Clear All
            </button>
          </div>
          <div className="flex-1 flex justify-end min-w-[200px] mt-2 md:mt-0">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-gold-400 rounded-full focus:outline-none focus:ring-2 focus:ring-gold-400 w-full max-w-xs bg-black text-gold-400 placeholder-gold-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-gold-400 font-serif">Sort by Price:</label>
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value as 'low' | 'high')}
              className="bg-black border border-gold-400 text-gold-400 rounded px-2 py-1"
            >
              <option value="low">Low to High</option>
              <option value="high">High to Low</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showDiscountedOnly}
              onChange={e => setShowDiscountedOnly(e.target.checked)}
              id="discountedOnly"
              className="accent-gold-500 w-5 h-5"
            />
            <label htmlFor="discountedOnly" className="text-gold-400 font-serif text-lg font-bold flex items-center gap-1">
              On Sale Only
              {showDiscountedOnly && <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold ml-1">SALE</span>}
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showSpecialEditionsOnly}
              onChange={e => setShowSpecialEditionsOnly(e.target.checked)}
              id="specialEditionsOnly"
              className="accent-gold-500 w-5 h-5"
            />
            <label htmlFor="specialEditionsOnly" className="text-gold-400 font-serif text-lg font-bold flex items-center gap-1">
              Special Editions Only
              {showSpecialEditionsOnly && <span className="bg-gold-500 text-black px-2 py-0.5 rounded text-xs font-bold ml-1">SPECIAL</span>}
            </label>
          </div>
        </div>
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center text-gold-400 text-lg py-12">No products found.</div>
          ) : (
            filteredProducts.map((product) => {
              const selectedCarat = caratSelections[product.id] || "";
              const selectedMetal = metalSelections[product.id] || product.ringMetal;
              // Find the product with the same shape/design/carat but selected metal
              const matchingProduct = products.find(p =>
                p.diamondShape === product.diamondShape &&
                p.ringDesign === product.ringDesign &&
                p.carats.join() === product.carats.join() &&
                p.ringMetal === selectedMetal
              ) || product;
              const origPrice = getDisplayPrice(product, selectedCarat);
              const discount = product.discountPercent || 0;
              const discountedPrice = origPrice && discount > 0 ? Math.round(origPrice * (1 - discount / 100)) : origPrice;
              return (
                <div
                  key={product.id}
                  className="bg-black rounded-2xl shadow-lg overflow-hidden flex flex-col border-2 border-gold-900 hover:border-gold-500 hover:shadow-2xl transition-all duration-200 cursor-pointer group relative"
                >
                  {product.isSpecialEdition && (
                    <span className="absolute top-2 left-2 bg-gold-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg z-20">Special Edition</span>
                  )}
                  <div onClick={() => {
                    setModalProduct(matchingProduct);
                    setModalCarat(selectedCarat || matchingProduct.carats[0] || "");
                    setModalMetal(selectedMetal);
                  }} className="flex-1 flex flex-col">
                    {matchingProduct.images && matchingProduct.images.length > 0 ? (
                      <img src={matchingProduct.images?.[0] || matchingProduct.mainImage} alt={matchingProduct.name} className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-200" />
                    ) : (
                      <img src={matchingProduct.mainImage} alt={matchingProduct.name} className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-200" />
                    )}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold font-serif text-gold-400 mb-2 truncate">{product.name}</h3>
                        <p className="text-gold-100 font-body mb-2 text-base">{product.description?.slice(0, 60)}{product.description && product.description.length > 60 ? '...' : ''}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="flex items-center gap-1 text-xs text-gold-400">{matchingProduct.diamondShape}</span>
                          <span className="flex items-center gap-1 text-xs text-gold-400">{matchingProduct.ringDesign}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div>
                            {origPrice ? (
                              discount > 0 ? (
                                <>
                                  <span className="line-through text-red-400 mr-2">${origPrice}</span>
                                  <span className="text-gold-400 font-bold">${discountedPrice}</span>
                                  <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded text-xs">-{discount}%</span>
                                </>
                              ) : (
                                <span className="text-xl font-bold text-gold-500 font-serif">${origPrice}</span>
                              )
                            ) : (
                              <span className="text-gold-400 font-serif">Contact for Price</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 p-4 border-t border-gold-900 bg-black">
                    <button
                      className="flex-1 bg-gold-500 text-black py-2 rounded-lg hover:bg-gold-600 transition-colors font-medium"
                      onClick={e => {
                        e.stopPropagation();
                        if (!selectedCarat) {
                          alert('Please select a carat.');
                          return;
                        }
                        onAddToCart({
                          ...matchingProduct,
                          carats: [selectedCarat],
                          price: matchingProduct.prices && selectedCarat ? matchingProduct.prices[selectedCarat] : matchingProduct.price
                        });
                      }}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="flex-1 border border-gold-500 text-gold-400 py-2 rounded-lg hover:bg-gold-50 font-medium"
                      onClick={e => {
                        e.stopPropagation();
                        setModalProduct(matchingProduct);
                        setModalCarat(selectedCarat || matchingProduct.carats[0] || "");
                        setModalMetal(selectedMetal);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      {/* Product Details Modal */}
      {modalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={() => setModalProduct(null)}>
          <div className="bg-black rounded-2xl shadow-2xl max-w-2xl w-full p-4 md:p-8 relative flex flex-col md:flex-row gap-8 border-2 border-gold-900 overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 text-gold-400 hover:text-gold-600 text-3xl font-bold"
              onClick={() => setModalProduct(null)}
              aria-label="Close"
            >
              &times;
            </button>
            {/* In the modal, use a two-column layout for images and info */}
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left: Images */}
              <div className="flex flex-col items-center md:w-1/2">
                <img
                  src={modalProduct.images && modalProduct.images.length > 0 ? modalProduct.images[activeImageIdx] : modalProduct.mainImage}
                  alt={modalProduct.name}
                  className="w-full max-w-xs h-auto aspect-square object-cover rounded border border-gold-900 mb-4"
                />
                <div className="flex gap-2">
                  {(modalProduct.images && modalProduct.images.length > 0 ? modalProduct.images : [modalProduct.mainImage]).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={modalProduct.name}
                      className={`w-16 h-16 object-cover rounded border-2 cursor-pointer transition-all duration-150 ${activeImageIdx === idx ? 'border-gold-500' : 'border-gold-900'}`}
                      onClick={() => setActiveImageIdx(idx)}
                    />
                  ))}
                </div>
              </div>

              {/* Right: Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gold-400">{modalProduct.name}</h2>
                  {/* In the modal, show the price for the selected carat */}
                  <p className="text-gold-500 font-bold text-xl md:text-2xl mb-2">
                    {modalProduct.prices && modalCarat && modalProduct.prices[modalCarat]
                      ? modalProduct.prices[modalCarat]
                      : modalProduct.prices && modalProduct.carats.length > 0
                        ? modalProduct.prices[modalProduct.carats[0]]
                        : ''}
                  </p>
                  <div className="flex flex-wrap gap-3 md:gap-2 mb-4">
                    <span className="flex items-center gap-1 text-sm text-gold-400">{modalProduct.diamondShape}</span>
                    <span className="flex items-center gap-1 text-sm text-gold-400">{modalProduct.ringDesign}</span>
                    {/* Metal selection in modal */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {ringMetals.map(metal => (
                        <button
                          key={metal}
                          title={metal}
                          className={`w-8 h-8 rounded border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400 ${metalColors[metal]} ${modalMetal === metal ? 'ring-2 ring-gold-500 border-gold-500' : ''}`}
                          onClick={() => {
                            // Find the product with the same shape and design and the selected metal (ignore carats array)
                            const newProduct = products.find(p =>
                              p.diamondShape === modalProduct.diamondShape &&
                              p.ringDesign === modalProduct.ringDesign &&
                              p.ringMetal === metal
                            );
                            if (newProduct) {
                              setModalProduct(newProduct);
                              setModalMetal(metal);
                              setActiveImageIdx(0);
                              setModalCarat(newProduct.carats[0] || "");
                            }
                          }}
                          aria-label={metal}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Carat selection */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {modalProduct.carats.map(carat => (
                      <button
                        key={carat}
                        className={`px-3 py-1 rounded border font-bold text-xs transition-colors ${modalCarat === carat ? 'bg-gold-500 text-black border-gold-600' : 'bg-black text-gold-400 border-gold-400 hover:bg-gold-900'}`}
                        onClick={() => setModalCarat(carat)}
                      >
                        {carat}
                      </button>
                    ))}
                  </div>
                  <p className="text-gold-100 mb-4 text-base md:text-lg">{modalProduct.description}</p>
                </div>
                <button
                  className="w-full bg-gold-500 text-black py-3 rounded-lg hover:bg-gold-600 transition-colors font-semibold text-lg mt-4"
                  onClick={() => {
                    if (!modalCarat) {
                      alert('Please select a carat.');
                      return;
                    }
                    onAddToCart({
                      ...modalProduct,
                      carats: [modalCarat],
                      price: modalProduct.prices && modalCarat ? modalProduct.prices[modalCarat] : modalProduct.price
                    });
                    setModalProduct(null);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop; 