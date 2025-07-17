import React from 'react';
import type { Product } from './Shop';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Product[];
  onRemove: (productId: number) => void;
  onCheckout: () => void;
  disabled?: boolean;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cart, onRemove, onCheckout, disabled }) => {
  const total = cart.reduce((sum, item) => sum + Number(item.price.replace(/[^\d.]/g, '')), 0);

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-black border-l-2 border-gold-500 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out font-serif ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ maxWidth: '90vw' }}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-gold-500 bg-black">
        <h2 className="text-xl font-bold text-gold-400">Your Cart</h2>
        <button onClick={onClose} className="text-gold-400 hover:text-gold-600 text-2xl font-bold">&times;</button>
      </div>
      <div className="p-6 flex-1 flex flex-col gap-4 overflow-y-auto bg-black" style={{ maxHeight: 'calc(100vh - 120px)' }}>
        {cart.length === 0 ? (
          <div className="text-gold-400 text-center mt-10 font-serif text-lg">Your cart is empty.</div>
        ) : (
          cart.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 border-b border-gold-900 pb-4 last:border-b-0">
              <img src={item.mainImage} alt={item.name} className="w-16 h-16 object-cover rounded border border-gold-900" />
              <div className="flex-1">
                <div className="font-semibold text-gold-400">{item.name}</div>
                <div className="text-gold-500 font-bold">{item.price}</div>
              </div>
              <button
                onClick={() => onRemove(item.id)}
                className="text-red-400 hover:text-red-600 text-xs font-bold px-2 border border-red-400 rounded"
                aria-label="Remove from cart"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
      <div className="px-6 py-4 border-t border-gold-500 bg-black">
        <div className="flex justify-between items-center text-gold-400 font-semibold text-lg">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button
          className="w-full mt-4 bg-gold-500 text-black py-2 rounded hover:bg-gold-600 transition-colors font-medium disabled:opacity-50 font-serif text-lg shadow"
          disabled={cart.length === 0 || disabled}
          onClick={onCheckout}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartDrawer; 