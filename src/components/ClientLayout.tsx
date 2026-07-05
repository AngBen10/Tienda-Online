'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <Navbar onOpenCart={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/595971186482"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95"
        style={{ backgroundColor: '#25D366' }}
      >
        {/* WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="w-7 h-7 fill-white"
          aria-hidden="true"
        >
          <path d="M16.003 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.363.618 4.678 1.794 6.717L2.667 29.333l6.777-1.775A13.3 13.3 0 0 0 16.003 29.333C23.37 29.333 29.333 23.363 29.333 16S23.37 2.667 16.003 2.667zm0 2.4c5.8 0 10.53 4.73 10.53 10.533 0 5.803-4.73 10.533-10.53 10.533a10.5 10.5 0 0 1-5.352-1.464l-.384-.232-3.985 1.043 1.063-3.876-.253-.4A10.5 10.5 0 0 1 5.47 16c0-5.803 4.73-10.533 10.533-10.533zm-2.93 5.6c-.21 0-.553.079-.843.395-.29.316-1.108 1.082-1.108 2.637s1.134 3.06 1.292 3.27c.158.21 2.21 3.375 5.374 4.735.749.323 1.334.516 1.79.66.753.238 1.438.205 1.979.124.603-.09 1.858-.76 2.12-1.494.262-.734.262-1.363.184-1.494-.079-.13-.29-.21-.604-.368-.316-.158-1.868-.921-2.157-1.027-.29-.105-.5-.158-.71.158-.21.316-.815 1.027-.999 1.238-.184.21-.368.236-.683.079-.316-.158-1.335-.492-2.542-1.568-.94-.837-1.575-1.87-1.76-2.186-.184-.316-.02-.487.138-.644.142-.141.316-.368.474-.552.158-.184.21-.316.316-.526.105-.21.053-.395-.026-.553-.079-.158-.71-1.712-.973-2.343-.256-.612-.516-.529-.71-.538l-.604-.01z"/>
        </svg>
      </a>
    </>
  );
}
