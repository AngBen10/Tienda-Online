'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [current, setCurrent] = useState(0);

  const validImages = images.filter(Boolean);
  if (validImages.length === 0) {
    return (
      <div className="relative aspect-square md:h-[600px] w-full bg-neutral-100 dark:bg-neutral-900 rounded-2xl overflow-hidden flex items-center justify-center">
        <span className="text-neutral-400">Sin imagen</span>
      </div>
    );
  }

  const prev = () => setCurrent((c) => (c - 1 + validImages.length) % validImages.length);
  const next = () => setCurrent((c) => (c + 1) % validImages.length);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square md:h-[520px] w-full bg-neutral-100 dark:bg-neutral-900 rounded-2xl overflow-hidden group">
        <img
          key={current}
          src={validImages[current]}
          alt={`${name} - foto ${current + 1}`}
          className="w-full h-full object-cover object-center transition-opacity duration-300"
        />
        {validImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/70 rounded-full p-2 shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-black"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/70 rounded-full p-2 shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-black"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            {/* Dot indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
              {validImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {validImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                i === current
                  ? 'border-black dark:border-white'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
