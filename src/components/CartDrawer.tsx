'use client'

import { useCartStore } from '@/store/cart';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '' });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    // Replace this with the actual target WhatsApp number (include country code, e.g., 54911...)
    const WHA_NUMBER = "+595 971186482";

    let text = `*Nuevo Pedido - Anglic*\n\n`;
    text += `*Cliente:* ${formData.name}\n`;
    text += `*Dirección:* ${formData.address}\n\n`;
    text += `*Productos:*\n`;

    items.forEach(item => {
      text += `- ${item.quantity}x ${item.name} ($${item.price.toLocaleString()})\n`;
    });

    text += `\n*Total:* $${total.toLocaleString()}`;

    const encodedText = encodeURIComponent(text);
    const waUrl = `https://wa.me/${WHA_NUMBER}?text=${encodedText}`;

    clearCart();
    onClose();
    setIsCheckingOut(false);

    window.open(waUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Tu Carrito
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-500 space-y-4">
              <ShoppingBag className="w-12 h-12 opacity-20" />
              <p>Tu carrito está vacío</p>
              <button
                onClick={onClose}
                className="text-sm underline hover:text-black dark:hover:text-white transition-colors"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 relative rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
                    {/* Using next/image requires domains config, we'll use a standard img tag for external urls for now or setup domains later */}
                    <img
                      src={item.image_url || 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=300&auto=format&fit=crop'}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-medium leading-tight">{item.name}</h3>
                      <p className="text-sm text-neutral-500 mt-1">${item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-md">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-red-500 hover:text-red-600 transition-colors underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-neutral-200 dark:border-neutral-800 p-4 bg-neutral-50 dark:bg-neutral-900/50">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Total</span>
              <span className="font-medium">${total.toLocaleString()}</span>
            </div>

            {isCheckingOut ? (
              <form onSubmit={handleCheckout} className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                <div>
                  <input
                    required
                    type="text"
                    placeholder="Tu nombre completo"
                    className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-shadow"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <input
                    required
                    type="text"
                    placeholder="Dirección de envío"
                    className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-shadow"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="flex-1 px-4 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 text-sm bg-[#25D366] text-white font-medium rounded-md hover:bg-[#128C7E] transition-colors shadow-sm"
                  >
                    Pedir por WhatsApp
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-md hover:opacity-90 transition-opacity shadow-sm"
              >
                Completar Pedido
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
