'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

type Slide = {
  key: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
};

// Carátulas fijas del hero. Fondos "ambiente" (no fotos de productos).
// Podés cambiar las imágenes por fotos propias: subilas a /public y
// apuntá "image" a "/mi-foto.jpg".
const SLIDES: Slide[] = [
  {
    key: 'welcome',
    eyebrow: 'Anglic · Hogar & Diseño',
    title: 'Todo para tu hogar',
    subtitle: 'Productos prácticos, tecnología y detalles de diseño para renovar tus espacios. Envíos a todo Paraguay.',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000&auto=format&fit=crop',
    ctaLabel: 'Explorar Catálogo',
    ctaHref: '/productos',
  },
  {
    key: 'best',
    eyebrow: 'Lo más vendido',
    title: 'Los favoritos de nuestros clientes',
    subtitle: 'Descubrí los productos que todos están eligiendo. Calidad comprobada al mejor precio.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000&auto=format&fit=crop',
    ctaLabel: 'Ver catálogo',
    ctaHref: '/productos',
  },
  {
    key: 'featured',
    eyebrow: 'Productos destacados',
    title: 'Seleccionados para vos',
    subtitle: 'Una selección especial de nuestros mejores productos para tu hogar y tu día a día.',
    image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=2000&auto=format&fit=crop',
    ctaLabel: 'Ver destacados',
    ctaHref: '/productos',
  },
];

export function HeroSlider() {
  const slides = SLIDES;
  const count = slides.length;
  const [current, setCurrent] = useState(0);
  const pausedRef = useRef(false);

  const go = useCallback(
    (dir: 1 | -1) => setCurrent((c) => (c + dir + count) % count),
    [count]
  );
  const goTo = (i: number) => setCurrent(i);

  // Auto-avance cada 5s (pausa al pasar el mouse o tocar)
  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => {
      if (!pausedRef.current) setCurrent((c) => (c + 1) % count);
    }, 5000);
    return () => clearInterval(t);
  }, [count]);

  return (
    <section
      className="relative h-[80vh] min-h-[520px] overflow-hidden bg-neutral-900"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
      onTouchStart={() => { pausedRef.current = true; }}
      onTouchEnd={() => { pausedRef.current = false; }}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.key}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {/* Fondo ambiente */}
          <div className="absolute inset-0">
            <img src={slide.image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
          </div>

          {/* Contenido */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
              <div className="max-w-2xl">
                <p
                  className={`text-sm md:text-base font-medium uppercase tracking-widest text-white/80 mb-4 transition-all duration-700 ${
                    i === current ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  {slide.eyebrow}
                </p>
                <h1
                  className={`text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-white mb-6 transition-all duration-700 delay-100 ${
                    i === current ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                >
                  {slide.title}
                </h1>
                <p
                  className={`text-lg md:text-xl text-neutral-200 mb-10 max-w-xl transition-all duration-700 delay-200 ${
                    i === current ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  {slide.subtitle}
                </p>
                <div
                  className={`transition-all duration-700 delay-300 ${
                    i === current ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                >
                  <Link
                    href={slide.ctaHref}
                    className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-neutral-200 transition-colors"
                  >
                    {slide.ctaLabel}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Flechas */}
      {count > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            aria-label="Anterior"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Siguiente"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Puntos indicadores */}
          <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.key}
                onClick={() => goTo(i)}
                aria-label={`Ir al slide ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === current ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
