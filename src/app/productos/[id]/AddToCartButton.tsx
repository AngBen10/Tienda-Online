'use client';

import { useCartStore, Product } from '@/store/cart';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <button
      onClick={handleAdd}
      disabled={isOutOfStock}
      className={`w-full py-4 px-8 rounded-full flex items-center justify-center gap-3 text-lg font-medium transition-all duration-300 ${
        isOutOfStock 
          ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed dark:bg-neutral-800' 
          : isAdded
            ? 'bg-green-600 text-white'
            : 'bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 shadow-lg hover:shadow-xl'
      }`}
    >
      <ShoppingCart className="w-5 h-5" />
      {isOutOfStock ? 'Agotado' : isAdded ? '¡Añadido!' : 'Añadir al carrito'}
    </button>
  );
}
