'use client';

import { MessageCircle } from 'lucide-react';

// Mismo número que en el checkout: solo dígitos, sin "+", ni espacios.
const WHATSAPP_NUMBER = '595971186482';

export function WhatsAppButton() {
  const message = encodeURIComponent('¡Hola Anglic! Quisiera hacer una consulta 🙂');
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#128C7E] hover:scale-105 transition-all"
    >
      <MessageCircle className="w-7 h-7" fill="currentColor" />
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-40 animate-ping -z-10" />
    </a>
  );
}
