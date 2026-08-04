"use client";

import React, { useState } from 'react';
import { Leaf, ShoppingCart, MapPin, Phone, User, CheckCircle2 } from 'lucide-react';

export default function LettuceLanding() {
  const [formData, setFormData] = useState({
    name: '',
    ruc: '',
    phone: '',
    location: '',
    quantity: 10,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.quantity < 10) {
      alert('La cantidad mínima es de 10 unidades.');
      return;
    }

    const message = `¡Hola! Me gustaría hacer un pedido de lechugas hidropónicas.%0A%0A*Detalles del pedido:*%0A- Nombre: ${formData.name}%0A- RUC/CI: ${formData.ruc}%0A- Teléfono: ${formData.phone}%0A- Ubicación: ${formData.location}%0A- Cantidad: ${formData.quantity} unidades%0A%0A¡Muchas gracias!`;
    const whatsappUrl = `https://wa.me/595982445472?text=${message}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans selection:bg-green-500 selection:text-white">
      {/* Navbar Simple */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold text-xl">
          <Leaf className="w-6 h-6" />
          <span>Lechugas Premium</span>
        </div>
      </nav>

      <main className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Section - Image & Copy */}
        <div className="lg:w-1/2 relative bg-green-900 overflow-hidden flex flex-col justify-center p-8 lg:p-16">
          <div className="absolute inset-0 opacity-40 mix-blend-overlay">
            <img
              src="/lechugas.jpg"
              alt="Lechugas frescas del invernadero"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-green-950/90 to-transparent lg:bg-gradient-to-r lg:from-green-950/90 lg:to-green-900/50" />

          <div className="relative z-10 text-white max-w-xl mx-auto lg:mx-0 mt-16 lg:mt-0">
            <span className="inline-block py-1 px-3 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 text-sm font-medium mb-6">
              Venta Mayorista
            </span>
            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Del Invernadero <br /> a tu Mesa.
            </h1>
            <p className="text-lg text-green-100 mb-8 leading-relaxed">
              Lechugas hidropónicas frescas, crujientes y de la mejor calidad. Cosechadas en el día para mantener todo su sabor y nutrientes.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-green-400 w-5 h-5" />
                <span>100% Frescas y Orgánicas</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-green-400 w-5 h-5" />
                <span>Sin pesticidas nocivos</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-green-400 w-5 h-5" />
                <span>Atención directa al WhatsApp</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white dark:bg-neutral-900">
          <div className="w-full max-w-md">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Realizá tu Pedido</h2>
              <p className="text-neutral-500 dark:text-neutral-400">
                Completá el formulario para comunicarte directamente con el proveedor. (Mínimo 10 unidades)
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 ml-1">
                  Nombre y Apellido
                </label>
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
                    placeholder="Juan Pérez"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 ml-1">
                  RUC / CI
                </label>
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
                    placeholder="1234567-8"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 ml-1">
                  Número de Teléfono
                </label>
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
                    placeholder="09xx xxx xxx"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 ml-1">
                  Ubicación (Dirección de entrega)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-transparent text-neutral-900 dark:text-white transition-shadow"
                    placeholder="Asunción, Barrio..."
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 ml-1">
                  Cantidad (Mín. 10 unidades)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ShoppingCart className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="number"
                    name="quantity"
                    min="10"
                    required
                    value={formData.quantity}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-transparent text-neutral-900 dark:text-white transition-shadow text-lg font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-green-600/30 mt-4"
              >
                Hacer pedido por WhatsApp
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}