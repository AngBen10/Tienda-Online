'use client';

import Link from 'next/link';
import { ShoppingCart, Flame } from 'lucide-react';
import { Product } from '@/store/cart';
import { useCartStore } from '@/store/cart';
import { formatGs } from '@/utils/format';

export function ProductCard({
  product,
  showBadge = false,
}: {
  product: Product;
  showBadge?: boolean;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product);
  };

  return (
    <Link href={`/productos/${product.id}`} className="group block">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800 xl:aspect-[4/5]">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=600&auto=format&fit=crop'}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge "Más vendido" */}
        {showBadge && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
            <Flame className="w-3 h-3" />
            Más vendido
          </div>
        )}

        {/* Badge "Agotado" */}
        {isOutOfStock && (
          <div className="absolute top-3 right-3 bg-neutral-900/80 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Agotado
          </div>
        )}

        {/* Botón agregar al carrito */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 px-4">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full bg-white/90 dark:bg-black/90 backdrop-blur-sm text-black dark:text-white flex items-center justify-center gap-2 py-3 px-4 rounded-md shadow-lg font-medium hover:bg-white dark:hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isOutOfStock ? 'Agotado' : 'Añadir al carrito'}</span>
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-col justify-between">
        <div>
          <h3 className="text-sm text-neutral-700 dark:text-neutral-300 font-medium truncate">{product.name}</h3>
        </div>
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-1">{formatGs(product.price)}</p>
      </div>
    </Link>
  );
}
