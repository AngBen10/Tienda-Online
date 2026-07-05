'use client';

import { useState, useMemo } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/store/cart';

export function CatalogGrid({ products }: { products: Product[] }) {
  const [active, setActive] = useState<string>('Todos');

  // Categorías únicas (ignora vacías), más "Todos" al inicio
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category && p.category.trim()) set.add(p.category.trim());
    });
    return ['Todos', ...Array.from(set).sort()];
  }, [products]);

  const filtered = useMemo(() => {
    if (active === 'Todos') return products;
    return products.filter((p) => (p.category || '').trim() === active);
  }, [products, active]);

  return (
    <div>
      {/* Filtros por categoría (solo si hay más de una categoría) */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                active === cat
                  ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                  : 'bg-transparent border-neutral-300 dark:border-neutral-700 hover:border-neutral-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filtered.length > 0 ? (
          filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-neutral-500">
            <p>No hay productos en esta categoría por el momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
