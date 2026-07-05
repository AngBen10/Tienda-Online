'use client';

import { useState, useMemo } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/store/cart';

interface CatalogClientProps {
  products: Product[];
}

export function CatalogClient({ products }: CatalogClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  const categories = useMemo(() => {
    const cats = products
      .map((p) => p.category)
      .filter((c): c is string => !!c);
    return ['Todos', ...Array.from(new Set(cats))];
  }, [products]);

  const filtered = useMemo(() => {
    if (activeCategory === 'Todos') return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <>
      {/* Category filter tabs */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                activeCategory === cat
                  ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-sm'
                  : 'border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-500 dark:hover:border-neutral-400'
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
            <p>No se encontraron productos en esta categoría.</p>
          </div>
        )}
      </div>
    </>
  );
}
