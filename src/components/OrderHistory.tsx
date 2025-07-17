import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: Timestamp;
  items: Array<{ name: string; carat: string; metal: string; qty: number; price: number }>;
}

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError('');
    const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
    getDocs(q)
      .then(snap => {
        setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-black border border-gold-500 rounded-xl p-8 shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gold-400 text-center">Order History</h2>
        {loading ? (
          <div className="text-gold-400 text-center">Loading orders...</div>
        ) : error ? (
          <div className="text-red-400 text-center">{error}</div>
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
      </div>
    </div>
  );
} 