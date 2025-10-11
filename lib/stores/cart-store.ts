// lib/stores/cart-store.ts - VERSÃO DEFINITIVA
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image_url?: string;
  slug: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  lastAddedItem: CartItem | null;
  showNotification: boolean;
  _hasHydrated: boolean; // Novo: controle de hidratação

  // Métodos
  addItem: (course: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  setIsOpen: (isOpen: boolean) => void;
  getItem: (id: string) => CartItem | undefined;
  isInCart: (id: string) => boolean;
  getSubtotal: () => number;
  hideNotification: () => void;
  setHasHydrated: (state: boolean) => void; // Novo
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      lastAddedItem: null,
      showNotification: false,
      _hasHydrated: false, // Inicialmente false

      // Novo método para controle de hidratação
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      addItem: (course) => {
        const { items, _hasHydrated } = get();

        // Só permite adicionar se já hidratou
        if (!_hasHydrated) return;

        const existingItem = items.find((item) => item.id === course.id);

        let newItems: CartItem[];

        if (existingItem) {
          newItems = items.map((item) =>
            item.id === course.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          newItems = [...items, { ...course, quantity: 1 }];
        }

        const addedItem = newItems.find((item) => item.id === course.id);

        set({
          items: newItems,
          lastAddedItem: addedItem || null,
          showNotification: true,
          isOpen: true,
        });

        setTimeout(() => {
          get().hideNotification();
        }, 3000);
      },

      removeItem: (id) => {
        const { items, _hasHydrated } = get();
        if (!_hasHydrated) return;
        set({ items: items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        const { items, _hasHydrated } = get();
        if (!_hasHydrated) return;

        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          items: items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        const { _hasHydrated } = get();
        if (!_hasHydrated) return;
        set({ items: [], showNotification: false });
      },

      getTotal: () => {
        const { items, _hasHydrated } = get();
        if (!_hasHydrated) return 0;
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getSubtotal: () => {
        const { items, _hasHydrated } = get();
        if (!_hasHydrated) return 0;
        return items.reduce(
          (subtotal, item) => subtotal + item.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        const { items, _hasHydrated } = get();
        if (!_hasHydrated) return 0;
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      getItem: (id) => {
        const { items, _hasHydrated } = get();
        if (!_hasHydrated) return undefined;
        return items.find((item) => item.id === id);
      },

      isInCart: (id) => {
        const { items, _hasHydrated } = get();
        if (!_hasHydrated) return false;
        return items.some((item) => item.id === id);
      },

      setIsOpen: (isOpen) => {
        const { _hasHydrated } = get();
        if (!_hasHydrated) return;
        set({ isOpen });
      },

      hideNotification: () => {
        const { _hasHydrated } = get();
        if (!_hasHydrated) return;
        set({ showNotification: false });
      },
    }),
    {
      name: "codecraft-cart-storage",
      storage: createJSONStorage(() => localStorage),
      // CORREÇÃO CRÍTICA: Controle de hidratação
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
      skipHydration: false,
    }
  )
);
