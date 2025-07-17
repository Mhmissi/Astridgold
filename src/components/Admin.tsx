import React, { useState, useEffect, ChangeEvent } from 'react';
import { Product as ShopProduct } from './Shop';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, Timestamp } from 'firebase/firestore';
import axios from "axios";
import ImageKit from "imagekit-javascript";

// New product type for admin and shop
export interface Product {
  id: string;
  name: string;
  price?: string;
  mainImage: string;
  description?: string;
  diamondShape: string;
  ringDesign: string;
  ringMetal: string;
  carats: string[];
  images?: string[];
  prices: { [carat: string]: string };
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

const LOCAL_KEY = 'admin_products';

const getInitialProducts = (): Product[] => {
  const stored = localStorage.getItem(LOCAL_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Generate all possible combinations (no carat)
const allCombos = diamondShapes.flatMap(shape =>
  ringDesigns.flatMap(design =>
    ringMetals.map(metal => ({ shape, design, metal }))
  )
);

const comboKey = (c: { shape: string; design: string; metal: string }) =>
  `${c.shape}|${c.design}|${c.metal}`;

const imagekit = new ImageKit({
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT
});

async function uploadToImageKit(file: File): Promise<string> {
  // 1. Get authentication parameters from your backend
  const authRes = await fetch(import.meta.env.VITE_IMAGEKIT_AUTH_ENDPOINT);
  const auth = await authRes.json();

  // 2. Use those parameters in the upload call
  return new Promise((resolve, reject) => {
    imagekit.upload(
      {
        file,
        fileName: file.name,
        folder: "/products",
        signature: auth.signature,
        expire: auth.expire,
        token: auth.token
      },
      function(err: any, result: any) {
        if (err) reject(err);
        else if (result && result.url) resolve(result.url);
        else reject(new Error("No result from ImageKit"));
      }
    );
  });
}

function isDuplicateCombination(products: Product[], form: Omit<Product, 'id'>, editingId?: string) {
  return products.some(
    (p) =>
      p.diamondShape === form.diamondShape &&
      p.ringDesign === form.ringDesign &&
      p.ringMetal === form.ringMetal &&
      (!editingId || p.id !== editingId)
  );
}

const Admin: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'> & { id?: string; imageFiles?: File[]; images?: string[] }>({
    name: '',
    prices: {},
    mainImage: '',
    description: '',
    diamondShape: '',
    ringDesign: '',
    ringMetal: '',
    carats: [],
    imageFiles: [],
    images: [],
    price: '',
  });
  const [previews, setPreviews] = useState<string[]>([]);
  const [valuations, setValuations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'valuations' | 'products' | 'orders'>('valuations');

  // Fetch products from Firestore
  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchValuations = async () => {
      const snap = await getDocs(collection(db, 'valuations'));
      setValuations(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchValuations();
  }, []);

  // Remove useEffect that appends to previews. Only set previews when images/files change.

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCaratChange = (carat: string) => {
    setForm((prev) => {
      const caratsArr = prev.carats.includes(carat)
        ? prev.carats.filter(c => c !== carat)
        : [...prev.carats, carat];
      return { ...prev, carats: caratsArr };
    });
  };

  // Handle price input for each carat
  const handleCaratPriceChange = (carat: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      prices: { ...prev.prices, [carat]: value },
    }));
  };

  // Handle multiple image selection
  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setForm((prev) => ({ ...prev, imageFiles: files }));
      // Generate previews
      Promise.all(files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      })).then((newPreviews) => setPreviews(newPreviews));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for duplicate combination
    if (isDuplicateCombination(products, form, editing?.id)) {
      alert("A product with this combination already exists. Please edit the existing product or choose a different combination.");
      return;
    }

    // Validate that every selected carat has a price
    for (const carat of form.carats) {
      if (!form.prices || !form.prices[carat] || form.prices[carat].trim() === '') {
        alert(`Please enter a price for ${carat}.`);
        return;
      }
    }

    let images: string[] = form.images || [];
    let mainImage = form.mainImage;

    // Upload all images to ImageKit if new files are selected
    if (form.imageFiles && form.imageFiles.length > 0) {
      try {
        images = await Promise.all(form.imageFiles.map(uploadToImageKit));
        mainImage = images[0];
      } catch (error) {
        alert("Image upload failed. Please try again.");
        return;
      }
    }

    const { imageFiles, ...productData } = form;

    if (editing) {
      await updateDoc(doc(db, 'products', editing.id as string), { ...productData, mainImage, images, prices: form.prices });
      setEditing(null);
    } else {
      await addDoc(collection(db, 'products'), { ...productData, mainImage, images, prices: form.prices });
    }

    setForm({
      name: '', prices: {}, mainImage: '', description: '', diamondShape: '', ringDesign: '', ringMetal: '', carats: [], imageFiles: [], images: [], price: ''
    });
    setPreviews([]);
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setForm({
      id: product.id,
      name: product.name || '',
      prices: product.prices || {},
      mainImage: product.mainImage || '',
      description: product.description || '',
      diamondShape: product.diamondShape || '',
      ringDesign: product.ringDesign || '',
      ringMetal: product.ringMetal || '',
      carats: Array.isArray(product.carats) ? product.carats : [],
      imageFiles: [],
      images: Array.isArray(product.images) ? product.images : (product.mainImage ? [product.mainImage] : []),
      price: product.price || '',
    });
    setPreviews(Array.isArray(product.images) ? product.images : (product.mainImage ? [product.mainImage] : []));
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
    if (editing && editing.id === id) {
      setEditing(null);
      setForm({ name: '', prices: {}, mainImage: '', description: '', diamondShape: '', ringDesign: '', ringMetal: '', carats: [], imageFiles: [], images: [], price: '' });
      setPreviews([]);
    }
    fetchProducts();
  };

  // Smart logic: find missing combos (no carat)
  const existingKeys = new Set(products.map(p => comboKey({ shape: p.diamondShape, design: p.ringDesign, metal: p.ringMetal })));
  const missingCombos = allCombos.filter(c => !existingKeys.has(comboKey(c)));
  const progress = allCombos.length - missingCombos.length;

  const quickAdd = (c: { shape: string; design: string; metal: string }) => {
    setEditing(null);
    setForm({
      name: '',
      prices: {},
      mainImage: '',
      description: '',
      diamondShape: c.shape,
      ringDesign: c.design,
      ringMetal: c.metal,
      carats: [],
      imageFiles: [],
      images: [],
      price: '',
    });
    setPreviews([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white py-10 px-4 font-serif">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gold-400">Admin Panel</h1>
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            className={`px-4 py-2 rounded-t font-bold ${activeTab === 'valuations' ? 'bg-gold-500 text-black' : 'bg-black text-gold-400 border-b-2 border-gold-500'}`}
            onClick={() => setActiveTab('valuations')}
          >
            Valuations
          </button>
          <button
            className={`px-4 py-2 rounded-t font-bold ${activeTab === 'products' ? 'bg-gold-500 text-black' : 'bg-black text-gold-400 border-b-2 border-gold-500'}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button
            className={`px-4 py-2 rounded-t font-bold ${activeTab === 'orders' ? 'bg-gold-500 text-black' : 'bg-black text-gold-400 border-b-2 border-gold-500'}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'valuations' && (
          <div className="mb-10 bg-black border border-gold-500 rounded-xl p-4 shadow">
            <h2 className="text-lg font-bold mb-3 text-gold-400">Valuation Requests</h2>
            {valuations.length === 0 ? (
              <div className="text-gold-400">No valuation requests yet.</div>
            ) : (
              <div className="overflow-x-auto max-h-96">
                <table className="min-w-full text-xs bg-black border border-gold-900 rounded-xl">
                  <thead>
                    <tr className="text-gold-400 border-b border-gold-900">
                      <th className="px-2 py-1">Name</th>
                      <th className="px-2 py-1">Email</th>
                      <th className="px-2 py-1">Phone</th>
                      <th className="px-2 py-1">Message</th>
                      <th className="px-2 py-1">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {valuations.map(val => (
                      <tr key={val.id} className="border-b border-gold-900">
                        <td className="px-2 py-1 text-gold-400">{val.name}</td>
                        <td className="px-2 py-1 text-gold-400">{val.email}</td>
                        <td className="px-2 py-1 text-gold-400">{val.phone}</td>
                        <td className="px-2 py-1 text-gold-400">{val.message}</td>
                        <td className="px-2 py-1 text-gold-400">{val.createdAt?.toDate?.().toLocaleString?.() || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <>
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gold-400 font-semibold">Upload Progress</span>
                <span className="text-gold-400">{progress} / {allCombos.length} combinations uploaded</span>
              </div>
              <div className="w-full h-3 bg-gold-900 rounded">
                <div
                  className="h-3 bg-gold-500 rounded transition-all"
                  style={{ width: `${(progress / allCombos.length) * 100}%` }}
                />
              </div>
            </div>
            {/* Missing Combos */}
            <div className="mb-10 bg-black border border-gold-500 rounded-xl p-4 shadow">
              <h2 className="text-lg font-bold mb-3 text-gold-400">Missing Product Combinations</h2>
              {missingCombos.length === 0 ? (
                <div className="text-gold-400">All combinations uploaded!</div>
              ) : (
                <div className="overflow-x-auto max-h-96">
                  <table className="min-w-full text-xs bg-black border border-gold-900 rounded-xl">
                    <thead>
                      <tr className="text-gold-400 border-b border-gold-900">
                        <th className="px-2 py-1">Shape</th>
                        <th className="px-2 py-1">Design</th>
                        <th className="px-2 py-1">Metal</th>
                        <th className="px-2 py-1">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {missingCombos.map((c) => (
                        <tr key={comboKey(c)} className="border-b border-gold-900">
                          <td className="px-2 py-1 text-gold-400">{c.shape}</td>
                          <td className="px-2 py-1 text-gold-400">{c.design}</td>
                          <td className="px-2 py-1 text-gold-400">{c.metal}</td>
                          <td className="px-2 py-1">
                            <button
                              className="bg-gold-500 text-black px-3 py-1 rounded font-bold hover:bg-gold-600 transition-colors"
                              onClick={() => quickAdd(c)}
                            >
                              Add
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {/* Product Form */}
            <form onSubmit={handleSubmit} className="bg-black border border-gold-500 rounded-xl p-6 mb-10 shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-gold-400">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-gold-400">Name</label>
                  <input name="name" value={form.name} onChange={handleInput} required className="w-full px-3 py-2 rounded bg-black border border-gold-400 text-gold-400" />
                </div>
                <div>
                  <label className="block mb-1 text-gold-400">Diamond Shape</label>
                  <select name="diamondShape" value={form.diamondShape} onChange={handleInput} required className="w-full px-3 py-2 rounded bg-black border border-gold-400 text-gold-400">
                    <option value="">Select</option>
                    {diamondShapes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-gold-400">Ring Design</label>
                  <select name="ringDesign" value={form.ringDesign} onChange={handleInput} required className="w-full px-3 py-2 rounded bg-black border border-gold-400 text-gold-400">
                    <option value="">Select</option>
                    {ringDesigns.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-gold-400">Ring Metal</label>
                  <select name="ringMetal" value={form.ringMetal} onChange={handleInput} required className="w-full px-3 py-2 rounded bg-black border border-gold-400 text-gold-400">
                    <option value="">Select</option>
                    {ringMetals.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-gold-400">Carats</label>
                  <div className="flex flex-wrap gap-2">
                    {carats.map(carat => (
                      <label key={carat} className="flex items-center gap-1 text-gold-400">
                        <input
                          type="checkbox"
                          checked={form.carats.includes(carat)}
                          onChange={() => handleCaratChange(carat)}
                          className="accent-gold-500"
                        />
                        {carat}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                  {form.carats.map((carat) => (
                    <div key={carat}>
                      <label className="block mb-1 text-gold-400">Price for {carat}</label>
                      <input
                        type="text"
                        value={form.prices[carat] || ''}
                        onChange={e => handleCaratPriceChange(carat, e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded bg-black border border-gold-400 text-gold-400"
                      />
                    </div>
                  ))}
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-1 text-gold-400">Description</label>
                  <textarea name="description" value={form.description} onChange={handleInput} rows={2} className="w-full px-3 py-2 rounded bg-black border border-gold-400 text-gold-400" />
                </div>
                <div className="md:col-span-2 flex flex-col md:flex-row gap-4 items-center">
                  <div>
                    <label className="block mb-1 text-gold-400">Images</label>
                    <input type="file" accept="image/*" multiple onChange={handleImages} className="text-gold-400" />
                  </div>
                  {previews.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {previews.map((src, idx) => (
                        <div key={idx} className="relative">
                          <img src={src} alt="Preview" className="w-24 h-24 object-cover rounded border border-gold-500" />
                          <button
                            type="button"
                            className="absolute top-0 right-0 bg-black bg-opacity-70 text-gold-400 rounded-full w-6 h-6 flex items-center justify-center"
                            onClick={() => {
                              setPreviews(previews.filter((_, i) => i !== idx));
                              setForm((prev) => ({
                                ...prev,
                                imageFiles: prev.imageFiles?.filter((_, i) => i !== idx) || [],
                              }));
                            }}
                            title="Remove"
                          >×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <button type="submit" className="bg-gold-500 text-black px-6 py-2 rounded font-bold hover:bg-gold-600 transition-colors">{editing ? 'Update' : 'Add'} Product</button>
                {editing && (
                  <button type="button" onClick={() => { setEditing(null); setForm({ name: '', prices: {}, mainImage: '', description: '', diamondShape: '', ringDesign: '', ringMetal: '', carats: [], imageFiles: [], images: [], price: '' }); setPreviews([]); }} className="bg-black border border-gold-400 text-gold-400 px-6 py-2 rounded font-bold hover:bg-gold-600 hover:text-black transition-colors">Cancel</button>
                )}
              </div>
            </form>
            <h2 className="text-xl font-bold mb-4 text-gold-400">Products</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-black border border-gold-900 rounded-xl">
                <thead>
                  <tr className="text-gold-400 border-b border-gold-900">
                    <th className="px-4 py-2">Image</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Shape</th>
                    <th className="px-4 py-2">Design</th>
                    <th className="px-4 py-2">Metal</th>
                    <th className="px-4 py-2">Carats</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr><td colSpan={8} className="text-center text-gold-400 py-6">No products yet.</td></tr>
                  ) : (
                    products.map(product => (
                      <tr key={product.id} className="border-b border-gold-900">
                        <td className="px-4 py-2">
                          <div className="flex gap-1 flex-wrap">
                            {product.images && product.images.length > 0 ? product.images.map((img, idx) => (
                              <img key={idx} src={img} alt={product.name} className="w-10 h-10 object-cover rounded border border-gold-900" />
                            )) : (
                              <img src={product.mainImage} alt={product.name} className="w-10 h-10 object-cover rounded border border-gold-900" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-gold-400 font-semibold">{product.name}</td>
                        <td className="px-4 py-2 text-gold-500 font-bold">
                          {(product.carats && Array.isArray(product.carats) && product.carats.length > 0) ? (
                            product.carats.map((carat) => (
                              <div key={carat}>
                                {carat}: <span className="text-gold-500 font-bold">{product.prices && product.prices[carat] ? product.prices[carat] : '-'}</span>
                              </div>
                            ))
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-gold-400">{product.diamondShape}</td>
                        <td className="px-4 py-2 text-gold-400">{product.ringDesign}</td>
                        <td className="px-4 py-2 text-gold-400">{product.ringMetal}</td>
                        <td className="px-4 py-2 text-gold-400">
                          {(product.carats && Array.isArray(product.carats) && product.carats.length > 0) ? (
                            product.carats.map((carat) => (
                              <div key={carat}>{carat}: <span className="text-gold-500 font-bold">{product.prices && product.prices[carat] ? product.prices[carat] : '-'}</span></div>
                            ))
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                        <td className="px-4 py-2 flex gap-2">
                          <button onClick={() => handleEdit(product)} className="bg-gold-500 text-black px-3 py-1 rounded font-bold hover:bg-gold-600 transition-colors">Edit</button>
                          <button onClick={() => handleDelete(product.id as string)} className="bg-black border border-gold-400 text-gold-400 px-3 py-1 rounded font-bold hover:bg-gold-600 hover:text-black transition-colors">Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'orders' && (
          <>
            {/* Orders Management Section */}
            <OrderManagement />
          </>
        )}
      </div>
    </div>
  );
};

// --- Order Management Component ---
interface UserInfo {
  name?: string;
  email?: string;
}

interface OrderItem {
  name: string;
  carat: string;
  metal: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  total: number;
  status: string;
  createdAt: Timestamp;
  items: OrderItem[];
}

const statusOptions = ['Pending', 'Processing', 'Shipped', 'Cancelled'];

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [updating, setUpdating] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState<string | null>(null);
  const [userMap, setUserMap] = React.useState<Record<string, UserInfo>>({});
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [products, setProducts] = React.useState<any[]>([]);

  // Fetch all orders, user info, and products
  const fetchOrdersAndUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const snap = await getDocs(collection(db, 'orders'));
      const fetchedOrders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(fetchedOrders);
      // Get unique userIds
      const userIds = Array.from(new Set(fetchedOrders.map(o => o.userId)));
      // Fetch user info for each userId
      const userSnaps = await Promise.all(userIds.map(uid => getDocs(collection(db, 'users')).then(qs => qs.docs.find(d => d.id === uid))));
      const userMapObj: Record<string, UserInfo> = {};
      userSnaps.forEach((snap, idx) => {
        if (snap && snap.exists()) {
          userMapObj[userIds[idx]] = snap.data() as UserInfo;
        }
      });
      setUserMap(userMapObj);
      // Fetch all products for image lookup
      const prodSnap = await getDocs(collection(db, 'products'));
      setProducts(prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchOrdersAndUsers();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setOrders(orders => orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert('Failed to update status');
    }
    setUpdating(null);
  };

  const handleDelete = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    setDeleting(orderId);
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      setOrders(orders => orders.filter(o => o.id !== orderId));
    } catch (err) {
      alert('Failed to delete order');
    }
    setDeleting(null);
  };

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    const user = userMap[order.userId] || {};
    const matchesUser =
      !search ||
      (user.name && user.name.toLowerCase().includes(search.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesUser && matchesStatus;
  });

  return (
    <div className="max-w-5xl mx-auto mt-16">
      <h2 className="text-xl font-bold mb-4 text-gold-400">Orders</h2>
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by user name or email"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-black border border-gold-400 text-gold-400 rounded px-3 py-2 text-sm"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-black border border-gold-400 text-gold-400 rounded px-3 py-2 text-sm"
        >
          <option value="">All Statuses</option>
          {statusOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="text-gold-400">Loading orders...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-gold-100">No orders found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-black border border-gold-900 rounded-xl text-xs">
            <thead>
              <tr className="text-gold-400 border-b border-gold-900">
                <th className="px-2 py-1">Order ID</th>
                <th className="px-2 py-1">Date</th>
                <th className="px-2 py-1">User</th>
                <th className="px-2 py-1">Status</th>
                <th className="px-2 py-1">Total</th>
                <th className="px-2 py-1">Items</th>
                <th className="px-2 py-1">Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => {
                const user = userMap[order.userId] || {};
                return (
                  <tr key={order.id} className="border-b border-gold-900">
                    <td className="px-2 py-1 text-gold-400 font-mono">{order.id.slice(-6).toUpperCase()}</td>
                    <td className="px-2 py-1 text-gold-400">{order.createdAt && order.createdAt.toDate().toLocaleString()}</td>
                    <td className="px-2 py-1 text-gold-400">
                      {user.name ? <span>{user.name}</span> : <span className="italic text-gold-900">No name</span>}
                      <br />
                      <span className="text-xs text-gold-500">{user.email || order.userId}</span>
                    </td>
                    <td className="px-2 py-1">
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        className="bg-black border border-gold-400 text-gold-400 rounded px-2 py-1 text-xs"
                        disabled={updating === order.id}
                      >
                        {statusOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-1 text-gold-500 font-bold">€{order.total.toFixed(2)}</td>
                    <td className="px-2 py-1">
                      <button
                        className="bg-gold-500 text-black px-2 py-1 rounded font-bold hover:bg-gold-600 transition-colors"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View
                      </button>
                    </td>
                    <td className="px-2 py-1">
                      <button
                        className="bg-black border border-gold-400 text-gold-400 px-2 py-1 rounded font-bold hover:bg-gold-600 hover:text-black transition-colors"
                        onClick={() => handleDelete(order.id)}
                        disabled={deleting === order.id}
                      >
                        {deleting === order.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {/* Order Items Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-black border border-gold-500 rounded-xl p-8 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gold-400 text-2xl font-bold"
              onClick={() => setSelectedOrder(null)}
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-4 text-gold-400">Order #{selectedOrder.id.slice(-6).toUpperCase()}</h3>
            <div className="mb-2 text-gold-400 text-sm">
              User: {userMap[selectedOrder.userId]?.name || <span className="italic text-gold-900">No name</span>}<br />
              <span className="text-xs text-gold-500">{userMap[selectedOrder.userId]?.email || selectedOrder.userId}</span>
            </div>
            <div className="mb-2 text-gold-400 text-sm">Date: {selectedOrder.createdAt && selectedOrder.createdAt.toDate().toLocaleString()}</div>
            <div className="mb-2 text-gold-400 text-sm">Status: {selectedOrder.status}</div>
            <div className="mb-2 text-gold-500 font-bold text-lg">Total: €{selectedOrder.total.toFixed(2)}</div>
            <table className="min-w-full text-xs bg-black border border-gold-900 rounded-xl mt-4">
              <thead>
                <tr className="text-gold-400 border-b border-gold-900">
                  <th className="px-2 py-1">Image</th>
                  <th className="px-2 py-1">Product</th>
                  <th className="px-2 py-1">Carat</th>
                  <th className="px-2 py-1">Metal</th>
                  <th className="px-2 py-1">Qty</th>
                  <th className="px-2 py-1">Price</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item, idx) => {
                  // Try to find the product in the products list by name, carat, and metal
                  const product = products && products.find(p =>
                    p.name === item.name &&
                    p.ringMetal === item.metal &&
                    (p.carats?.includes(item.carat) || (p.carats && p.carats[0] === item.carat))
                  );
                  const imgSrc = product?.images?.[0] || product?.mainImage || '';
                  return (
                    <tr key={idx} className="border-b border-gold-900">
                      <td className="px-2 py-1">
                        {imgSrc ? <img src={imgSrc} alt={item.name} className="w-10 h-10 object-cover rounded border border-gold-900" /> : <span className="text-gold-900 italic">No image</span>}
                      </td>
                      <td className="px-2 py-1 text-gold-400">{item.name}</td>
                      <td className="px-2 py-1 text-gold-400">{item.carat}</td>
                      <td className="px-2 py-1 text-gold-400">{item.metal}</td>
                      <td className="px-2 py-1 text-gold-400">{item.qty}</td>
                      <td className="px-2 py-1 text-gold-500">€{item.price.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin; 