'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { Product } from '@/store/cart';
import { useCartStore } from '@/store/cart';
import { ChevronLeft, ChevronRight, Flame, ShoppingCart } from 'lucide-react';

export function HotCarousel({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isPaused = useRef(false);
  const addItem = useCartStore((state) => state.addItem);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  const scroll = useCallback((dir: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' });
  }, []);

  // Scroll state listener
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [updateScrollState]);

  // Auto-scroll every 4 seconds
  useEffect(() => {
    if (!products || products.length === 0) return;

    const interval = setInterval(() => {
      if (isPaused.current) return;
      const el = trackRef.current;
      if (!el) return;

      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      if (atEnd) {
        // Loop back to start
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: 340, behavior: 'smooth' });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [products]);

  const pause = useCallback(() => { isPaused.current = true; }, []);
  const resume = useCallback(() => { isPaused.current = false; }, []);

  if (!products || products.length === 0) return null;

  return (
    <section className="py-20 bg-neutral-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </span>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-2">
                En Tendencia
                <Flame className="w-8 h-8 text-orange-500 inline-block" />
              </h2>
              <p className="text-neutral-400 text-sm mt-1">Lo más elegido por nuestros clientes</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-2 rounded-full border border-white/20 hover:border-white/60 disabled:opacity-20 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-2 rounded-full border border-white/20 hover:border-white/60 disabled:opacity-20 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable track */}
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseEnter={pause}
          onMouseLeave={resume}
          onTouchStart={pause}
          onTouchEnd={resume}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-64 sm:w-72 snap-start"
            >
              {/* Hot product card (inline, dark-themed) */}
              <Link href={`/productos/${product.id}`} className="group block">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-800 xl:aspect-[4/5]">
                  <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=600&auto=format&fit=crop'}
                    alt={product.name}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* 🔥 Más vendido badge */}
                  <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 z-10">
                    🔥 Más vendido
                  </span>

                  {/* Add to cart overlay button */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 px-4">
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem(product); }}
                      className="w-full bg-white/90 backdrop-blur-sm text-black flex items-center justify-center gap-2 py-3 px-4 rounded-md shadow-lg font-medium hover:bg-white transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Añadir al carrito</span>
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm text-neutral-200 font-medium truncate">{product.name}</h3>
                  </div>
                  <p className="text-sm font-semibold text-neutral-300 mt-1">
                    Gs. {product.price.toLocaleString('es-PY')}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Mobile scroll hint */}
        <div className="flex justify-center gap-2 mt-6 md:hidden">
          <button onClick={() => scroll('left')} disabled={!canScrollLeft} className="p-2 rounded-full border border-white/20 disabled:opacity-20 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll('right')} disabled={!canScrollRight} className="p-2 rounded-full border border-white/20 disabled:opacity-20 transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
