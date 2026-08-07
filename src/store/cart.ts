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
  sales_count?: number;
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

// Tope de unidades según el stock del producto.
// Si no viene stock definido, permitimos hasta 99 por las dudas.
const maxFor = (p: { stock?: number }) =>
  typeof p.stock === 'number' ? p.stock : 99;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const limit = maxFor(product);
          if (limit < 10) return state; // sin stock suficiente (mínimo 10)

          const existingItem = state.items.find((item) => item.id === product.id);
          if (existingItem) {
            const nextQty = Math.min(existingItem.quantity + 1, limit);
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: nextQty } : item
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 10 }] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== productId) return item;
            const limit = maxFor(item);
            if (quantity < 10) {
              return { ...item, quantity: 10 };
            }
            const safeQty = Math.min(quantity, limit);
            return { ...item, quantity: safeQty };
          }),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'anglic-cart-storage',
    }
  )
);
