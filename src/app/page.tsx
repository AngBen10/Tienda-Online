"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapPin, Phone, User, Minus, Plus, ShoppingCart, X, CheckCircle2 } from 'lucide-react';

const PRODUCTS = [
  { id: 'albahaca', name: 'Albahaca', price: 3000, image: '/albahaca.jpg' },
  { id: 'berro', name: 'Berro', price: 3000, image: '/berro.jpg' },
  { id: 'lechugas_pirati', name: 'Lechugas Piratí', price: 4000, image: '/lechugas_pirati.jpg' },
  { id: 'lechuga_romana', name: 'Lechuga Romana', price: 4500, image: '/lechuga_romana.jpg' },
  { id: 'perejil', name: 'Perejil', price: 2000, image: '/perejil.jpg' },
  { id: 'cilantro', name: 'Cilantro', price: 2000, image: '/cilantro.jpg' },
  { id: 'rucula', name: 'Rúcula', price: 2500, image: '/rucula.jpg' },
  { id: 'acelga', name: 'Acelga', price: 4000, image: '/acelga.jpg' },
];

const SLIDES = [
  {
    key: 'romana',
    title: 'Lechuga Romana',
    subtitle: 'Crujiente, fresca y cultivada con la mejor técnica hidropónica.',
    image: '/lechuga_romana.jpg',
  },
  {
    key: 'albahaca',
    title: 'Albahaca Fresca',
    subtitle: 'Aroma intenso y calidad premium, ideal para tus mejores platos.',
    image: '/albahaca.jpg',
  },
  {
    key: 'acelga',
    title: 'Acelga Orgánica',
    subtitle: 'Hojas verdes llenas de nutrientes, directo del invernadero a tu mesa.',
    image: '/acelga.jpg',
  },
];

export default function LettuceLanding() {
  // Hero Slider State
  const count = SLIDES.length;
  const [currentSlide, setCurrentSlide] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const t = setInterval(() => {
      if (!pausedRef.current) setCurrentSlide((c) => (c + 1) % count);
    }, 4000);
    return () => clearInterval(t);
  }, [count]);

  const goToSlide = (i: number) => setCurrentSlide(i);

  // Cart & Form State
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ruc: '',
    phone: '',
    location: '',
  });

  // Success state for order confirmation animation
  const [orderSent, setOrderSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Minimum quantity per product = 10
  const updateCart = (id: string, delta: number) => {
    setCart(prev => {
      const current = prev[id] || 0;
      if (current === 0 && delta > 0) {
        // Adding product for the first time starts at minimum 10
        return { ...prev, [id]: 10 };
      }
      const next = current + delta;
      if (next < 10) {
        // Decreasing below 10 removes product from cart
        const newCart = { ...prev };
        delete newCart[id];
        return newCart;
      }
      return { ...prev, [id]: next };
    });
  };

  const resetOrder = useCallback(() => {
    setCart({});
    setFormData({ name: '', ruc: '', phone: '', location: '' });
    setOrderSent(false);
    setIsCartOpen(false);
  }, []);

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((total, [id, qty]) => {
    const product = PRODUCTS.find(p => p.id === id);
    return total + (product ? product.price * qty : 0);
  }, 0);

  // Check if any product has invalid quantity (< 10)
  const invalidItems = Object.entries(cart).filter(([_, qty]) => qty > 0 && qty < 10);
  const isCartValid = totalItems > 0 && invalidItems.length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCartValid) {
      alert('La cantidad mínima de compra es de 10 unidades por producto.');
      return;
    }

    const orderDetails = Object.entries(cart)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const p = PRODUCTS.find(p => p.id === id);
        return `- ${qty}x ${p?.name} (${(p!.price * qty).toLocaleString('es-PY')} Gs)`;
      })
      .join('%0A');

    const message = `¡Hola! Me gustaría hacer un pedido.%0A%0A*Detalles del cliente:*%0A- Nombre: ${formData.name}%0A- RUC/CI: ${formData.ruc}%0A- Teléfono: ${formData.phone}%0A- Ubicación: ${formData.location}%0A%0A*Productos:*%0A${orderDetails}%0A%0A*Total Estimado: ${totalPrice.toLocaleString('es-PY')} Gs*%0A%0A¡Muchas gracias!`;
    const whatsappUrl = `https://wa.me/595982445472?text=${message}`;

    window.open(whatsappUrl, '_blank');

    // Show success animation then reset data
    setOrderSent(true);
    setTimeout(() => {
      resetOrder();
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans selection:bg-green-500 selection:text-white pb-24">
      {/* Navbar with Hidrotec Logo */}
      <nav className="absolute top-0 w-full p-4 md:p-6 flex justify-between items-center z-30 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-3 text-white font-bold text-xl">
          <img
            src="/logo.jpg"
            alt="Hidrotec"
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white/30 shadow-lg"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-lg md:text-xl font-extrabold tracking-tight">HIDROTEC</span>
            <span className="text-[10px] md:text-xs font-normal text-green-300 tracking-widest uppercase">Cultivo Hidropónico</span>
          </div>
        </div>
      </nav>

      {/* Hero Slider */}
      <section
        className="relative h-[60vh] min-h-[400px] overflow-hidden bg-neutral-900"
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
        onTouchStart={() => { pausedRef.current = true; }}
        onTouchEnd={() => { pausedRef.current = false; }}
      >
        {SLIDES.map((slide, i) => (
          <div
            key={slide.key}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
          >
            <div className="absolute inset-0">
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
            </div>

            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
              <h1
                className={`text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 transition-all duration-700 delay-100 ${i === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
              >
                {slide.title}
              </h1>
              <p
                className={`text-lg md:text-2xl text-green-100 max-w-2xl transition-all duration-700 delay-200 ${i === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
              >
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
        {/* Puntos del Slider */}
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-3">
          {SLIDES.map((s, i) => (
            <button
              key={s.key}
              onClick={() => goToSlide(i)}
              className={`h-2 rounded-full transition-all ${i === currentSlide ? 'w-8 bg-green-500' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
            />
          ))}
        </div>
      </section>

      {/* Main Content: Products */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tight mb-4">Nuestros Productos</h2>
          <p className="text-lg text-neutral-500 dark:text-neutral-400">Seleccioná los mejores productos de nuestro invernadero. <br className="hidden md:block" />Mínimo de compra: 10 unidades por producto.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map(product => {
            const qty = cart[product.id] || 0;
            return (
              <div key={product.id} className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-xl transition-shadow group flex flex-col">
                <div className="h-48 bg-neutral-100 dark:bg-neutral-800 relative overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {qty > 0 && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white min-w-8 h-8 px-2 rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                      {qty}
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">{product.name}</h3>
                  <p className="text-green-600 dark:text-green-400 font-semibold text-lg mb-1">{product.price.toLocaleString('es-PY')} Gs</p>
                  <p className="text-xs text-neutral-400 mb-4">Mínimo 10 unids.</p>

                  <div className="mt-auto">
                    {qty === 0 ? (
                      <button
                        onClick={() => updateCart(product.id, 1)}
                        className="w-full bg-neutral-100 dark:bg-neutral-800 hover:bg-green-500 hover:text-white dark:hover:bg-green-600 text-neutral-700 dark:text-neutral-300 font-semibold py-3 rounded-xl transition-colors flex justify-center items-center gap-2"
                      >
                        <Plus className="w-5 h-5" /> Agregar 10 unids.
                      </button>
                    ) : (
                      <div className="flex items-center justify-between bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1">
                        <button
                          onClick={() => updateCart(product.id, -1)}
                          className="w-10 h-10 rounded-lg flex items-center justify-center bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 shadow-sm hover:text-red-500 transition-colors"
                          title={qty === 10 ? "Quitar producto" : "Restar 1"}
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <span className="font-bold text-lg">{qty}</span>
                        <button
                          onClick={() => updateCart(product.id, 1)}
                          className="w-10 h-10 rounded-lg flex items-center justify-center bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 shadow-sm hover:text-green-500 transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ANGLEX Footer */}
      <footer className="bg-neutral-900 dark:bg-black border-t border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Top: Hidrotec branding */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <img src="/logo.jpg" alt="Hidrotec" className="w-10 h-10 rounded-full object-cover border border-white/20" />
              <div>
                <span className="text-white font-bold text-lg tracking-tight">HIDROTEC</span>
                <p className="text-neutral-500 text-xs">Cultivo Hidropónico Premium</p>
              </div>
            </div>
            <div className="flex gap-6 text-neutral-500 text-sm">
              <span>📞 +595 982 445 472</span>
              <span>📍 Paraguay</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-800 pt-6">
            <div className="flex flex-col items-center gap-2">
              <p className="text-neutral-500 text-xs tracking-wide">
                Powered by <span className="font-bold text-[#00A19B]">ANGLEX</span>
              </p>
              <p className="text-neutral-600 text-[10px] tracking-widest uppercase">
                Software Solutions v2026
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky Bottom Cart Button */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 z-40 transform translate-y-0 transition-transform shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">Total ({totalItems} items)</p>
              <p className="text-2xl font-black text-green-600 dark:text-green-400">{totalPrice.toLocaleString('es-PY')} Gs</p>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-lg shadow-green-600/30 flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Ver Carrito
            </button>
          </div>
        </div>
      )}

      {/* Cart Modal / Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-green-500" />
                Tu Pedido
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Order Sent Success Overlay */}
            {orderSent && (
              <div className="absolute inset-0 z-50 bg-white/95 dark:bg-neutral-900/95 flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-in zoom-in duration-500">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">¡Pedido Enviado!</h3>
                <p className="text-neutral-500 text-center max-w-xs">Tu pedido fue enviado por WhatsApp. Los datos se reiniciarán para un nuevo pedido.</p>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {/* Order Summary */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Resumen</h3>
                <div className="space-y-3">
                  {PRODUCTS.filter(p => cart[p.id] > 0).map(p => (
                    <div key={p.id} className="flex justify-between items-center text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">{cart[p.id]}x {p.name}</span>
                      <span className="font-semibold text-neutral-900 dark:text-white">{(p.price * cart[p.id]).toLocaleString('es-PY')} Gs</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                  <span className="font-bold text-neutral-900 dark:text-white">Total</span>
                  <span className="font-black text-xl text-green-600 dark:text-green-400">{totalPrice.toLocaleString('es-PY')} Gs</span>
                </div>
                {invalidItems.length > 0 && (
                  <p className="text-red-500 text-sm font-medium mt-2 bg-red-50 p-3 rounded-lg border border-red-100 dark:bg-red-950/30 dark:border-red-900/50">
                    El mínimo de compra es 10 unidades por producto.
                  </p>
                )}
              </div>

              {/* Form */}
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Tus Datos</h3>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-transparent text-neutral-900 dark:text-white transition-shadow"
                    placeholder="Nombre y Apellido"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="text"
                    name="ruc"
                    required
                    value={formData.ruc}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-transparent text-neutral-900 dark:text-white transition-shadow"
                    placeholder="RUC / CI"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-transparent text-neutral-900 dark:text-white transition-shadow"
                    placeholder="Número de Teléfono"
                  />
                </div>

                <div className="relative">
                  <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                    <MapPin className="h-5 w-5 text-neutral-400" />
                  </div>
                  <textarea
                    name="location"
                    required
                    rows={3}
                    value={formData.location}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-transparent text-neutral-900 dark:text-white transition-shadow resize-none"
                    placeholder="Dirección o referencia de entrega (ej: Av. Mariscal López 1234 c/ San Martín, Asunción)"
                  />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <button
                type="submit"
                form="checkout-form"
                disabled={!isCartValid}
                className={`w-full flex items-center justify-center gap-2 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${!isCartValid
                    ? 'bg-neutral-400 cursor-not-allowed shadow-none'
                    : 'bg-green-600 hover:bg-green-700 transform hover:scale-[1.02] active:scale-95 shadow-green-600/30'
                  }`}
              >
                Confirmar por WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #334155;
        }
      `}} />
    </div>
  );
}