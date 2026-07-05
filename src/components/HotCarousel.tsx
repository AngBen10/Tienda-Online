'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/store/cart';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';

export function HotCarousel({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isPausedRef = useRef(false); // pausa por hover o touch

  const updateScrollState = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener('scroll', updateScrollState);
  }, []);

  const scroll = useCallback((dir: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' });
  }, []);

  // Auto-scroll cada 4 segundos
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    if (!products || products.length <= 1) return; // nada que rotar

    const interval = setInterval(() => {
      if (isPausedRef.current) return; // no avanzar si el usuario está interactuando
      const current = trackRef.current;
      if (!current) return;

      // ¿Llegamos (casi) al final? -> volver al inicio
      const atEnd =
        current.scrollLeft + current.clientWidth >= current.scrollWidth - 5;

      if (atEnd) {
        current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: 300, behavior: 'smooth' });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [products]);

  const pause = () => { isPausedRef.current = true; };
  const resume = () => { isPausedRef.current = false; };

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
              <p className="text-neutral-400 text-sm mt-1">Lo más vendido por nuestros clientes</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-2 rounded-full border border-white/20 hover:border-white/60 disabled:opacity-20 transition-all"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-2 rounded-full border border-white/20 hover:border-white/60 disabled:opacity-20 transition-all"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Track con scroll + pausa en hover/touch */}
        <div
          ref={trackRef}
          onMouseEnter={pause}
          onMouseLeave={resume}
          onTouchStart={pause}
          onTouchEnd={resume}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-64 sm:w-72 snap-start"
            >
              <div className="[&_h3]:text-neutral-200 [&_p]:text-neutral-300 [&_div.bg-neutral-100]:bg-neutral-800 [&_div.dark\:bg-neutral-800]:bg-neutral-800">
                <ProductCard product={product} showBadge />
              </div>
            </div>
          ))}
        </div>

        {/* Controles en móvil */}
        <div className="flex justify-center gap-2 mt-6 md:hidden">
          <button onClick={() => scroll('left')} disabled={!canScrollLeft} className="p-2 rounded-full border border-white/20 disabled:opacity-20 transition-all" aria-label="Anterior">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll('right')} disabled={!canScrollRight} className="p-2 rounded-full border border-white/20 disabled:opacity-20 transition-all" aria-label="Siguiente">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
