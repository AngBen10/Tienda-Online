'use client';

import { useCartStore, Product } from '@/store/cart';
import { Plus, Minus } from 'lucide-react';

export function AddToCartButton({ product }: { product: Product }) {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();

  const cartItem = items.find((item) => item.id === product.id);
  const qty = cartItem?.quantity || 0;
  const stock = product.stock || 0;
  const isAgotado = stock < 10;

  const handleUpdate = (delta: number) => {
    if (qty === 0 && delta > 0) {
      if (stock >= 10) addItem(product); // El store ya lo inicializa en 10
      return;
    }
    const next = qty + delta;
    if (next > stock) return;
    if (next < 10) {
      removeItem(product.id);
    } else {
      updateQuantity(product.id, next);
    }
  };

  if (isAgotado) {
    return (
      <button disabled className="w-full bg-neutral-200 dark:bg-neutral-800 text-neutral-500 font-semibold py-4 rounded-xl cursor-not-allowed">
        Agotado (Stock insuficiente)
      </button>
    );
  }

  if (qty === 0) {
    return (
      <button
        onClick={() => handleUpdate(1)}
        className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold py-4 rounded-xl transition-colors flex justify-center items-center gap-2 hover:bg-green-600 dark:hover:bg-green-500"
      >
        <Plus className="w-5 h-5" /> Agregar 10 unids.
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between bg-neutral-100 dark:bg-neutral-800 rounded-xl p-2 max-w-xs">
      <button
        onClick={() => handleUpdate(-1)}
        className="w-12 h-12 rounded-lg flex items-center justify-center bg-white text-black shadow-sm hover:text-red-500 transition-colors"
      >
        <Minus className="w-6 h-6" />
      </button>
      <span className="font-bold text-xl">{qty}</span>
      <button
        onClick={() => handleUpdate(1)}
        className="w-12 h-12 rounded-lg flex items-center justify-center bg-white text-black shadow-sm hover:text-green-500 transition-colors"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}