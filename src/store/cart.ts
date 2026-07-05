import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  images?: string[];
  stock?: number;
  category?: string;
  description?: string;
  is_featured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);
          if (existingItem) {
            // Respect stock limit
            const maxQty = product.stock !== undefined ? product.stock : Infinity;
            const newQty = Math.min(existingItem.quantity + 1, maxQty);
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: newQty }
                  : item
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== productId) return item;
            const maxQty = item.stock !== undefined ? item.stock : Infinity;
            return { ...item, quantity: Math.min(quantity, maxQty) };
          }),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'anglic-cart-storage',
    }
  )
);
