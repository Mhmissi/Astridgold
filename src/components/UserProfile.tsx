import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: Timestamp;
  items: Array<{ name: string; carat: string; metal: string; qty: number; price: number }>;
}

export default function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ name: string; phone: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [tab, setTab] = useState<'profile' | 'orders'>('profile');

  useEffect(() => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid);
    getDoc(ref).then(snap => {
      if (snap.exists()) {
        setProfile(snap.data() as any);
      } else {
        setDoc(ref, { name: '', phone: '' });
        setProfile({ name: '', phone: '' });
      }
      setLoading(false);
    });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setOrdersLoading(true);
    setOrdersError('');
    const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
    getDocs(q)
      .then(snap => {
        setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
        setOrdersLoading(false);
      })
      .catch(err => {
        setOrdersError(err.message);
        setOrdersLoading(false);
      });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(p => ({ ...p!, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      await updateDoc(doc(db, 'users', user!.uid), profile!);
      setSuccess('Profile updated!');
    } catch (err: any) {
      setError(err.message);
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-black border border-gold-500 rounded-xl p-8 shadow-lg w-full max-w-2xl">
        <div className="flex gap-4 mb-8 justify-center">
          <button
            className={`px-4 py-2 rounded font-bold text-sm transition-colors ${tab === 'profile' ? 'bg-gold-500 text-black' : 'bg-black text-gold-400 border border-gold-400'}`}
            onClick={() => setTab('profile')}
          >
            Profile
          </button>
          <button
            className={`px-4 py-2 rounded font-bold text-sm transition-colors ${tab === 'orders' ? 'bg-gold-500 text-black' : 'bg-black text-gold-400 border border-gold-400'}`}
            onClick={() => setTab('orders')}
          >
            Order History
          </button>
        </div>
        {tab === 'profile' && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gold-400 text-center">User Profile</h2>
            <div className="mb-4 text-gold-400 text-lg text-center">Email: {user?.email}</div>
            <div className="mb-2 text-gold-400 text-sm text-center">User ID: {user?.uid}</div>
            <div className="mb-6 text-gold-400 text-sm text-center">Account Created: {user?.metadata?.creationTime}</div>
            {loading ? (
              <div className="text-gold-400 text-center">Loading profile...</div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-gold-400 mb-1">Name</label>
                  <input
                    name="name"
                    value={profile?.name || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded bg-black border border-gold-400 text-gold-400"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-gold-400 mb-1">Phone</label>
                  <input
                    name="phone"
                    value={profile?.phone || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded bg-black border border-gold-400 text-gold-400"
                    placeholder="Your phone number"
                  />
                </div>
                {success && <div className="text-green-400 text-sm">{success}</div>}
                {error && <div className="text-red-400 text-sm">{error}</div>}
                <button
                  type="submit"
                  className="w-full bg-gold-500 text-black py-2 rounded font-bold hover:bg-gold-600 transition-colors"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Update Profile'}
                </button>
              </form>
            )}
          </>
        )}
        {tab === 'orders' && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gold-400 text-center">Order History</h2>
            {ordersLoading ? (
              <div className="text-gold-400 text-center">Loading orders...</div>
            ) : ordersError ? (
              <div className="text-red-400 text-center">{ordersError}</div>
            ) : orders.length === 0 ? (
              <div className="text-gold-100 text-center">You have no orders yet.</div>
            ) : (
              <div className="space-y-8">
                {orders.map(order => (
                  <div key={order.id} className="border border-gold-900 rounded-lg p-4 bg-black/80">
                    <div className="flex flex-wrap justify-between items-center mb-2">
                      <div className="text-gold-400 font-bold">Order #{order.id.slice(-6).toUpperCase()}</div>
                      <div className="text-gold-400 text-sm">{order.createdAt && order.createdAt.toDate().toLocaleString()}</div>
                      <div className="text-gold-400 text-sm">Status: {order.status}</div>
                      <div className="text-gold-500 font-bold text-lg">Total: €{order.total.toFixed(2)}</div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-xs bg-black border border-gold-900 rounded-xl">
                        <thead>
                          <tr className="text-gold-400 border-b border-gold-900">
                            <th className="px-2 py-1">Product</th>
                            <th className="px-2 py-1">Carat</th>
                            <th className="px-2 py-1">Metal</th>
                            <th className="px-2 py-1">Qty</th>
                            <th className="px-2 py-1">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, idx) => (
                            <tr key={idx} className="border-b border-gold-900">
                              <td className="px-2 py-1 text-gold-400">{item.name}</td>
                              <td className="px-2 py-1 text-gold-400">{item.carat}</td>
                              <td className="px-2 py-1 text-gold-400">{item.metal}</td>
                              <td className="px-2 py-1 text-gold-400">{item.qty}</td>
                              <td className="px-2 py-1 text-gold-500">€{item.price.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 