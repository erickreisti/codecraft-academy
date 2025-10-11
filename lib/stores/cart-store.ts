// lib/stores/cart-store.ts - VERSÃO CORRIGIDA
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

  // NOVO: Sincronizar estado
  syncState: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      lastAddedItem: null,
      showNotification: false,

      // NOVO: Sincronizar estado entre abas
      syncState: () => {
        if (typeof window !== "undefined") {
          // Dispara evento customizado para sincronizar outras abas
          window.dispatchEvent(new Event("storage"));
        }
      },

      addItem: (course) => {
        const { items, syncState } = get();
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

        // Sincroniza outras abas
        syncState();

        setTimeout(() => {
          get().hideNotification();
        }, 3000);
      },

      removeItem: (id) => {
        const { items, syncState } = get();
        set({ items: items.filter((item) => item.id !== id) });
        syncState();
      },

      updateQuantity: (id, quantity) => {
        const { items, syncState } = get();

        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          items: items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
        syncState();
      },

      clearCart: () => {
        const { syncState } = get();
        set({ items: [], showNotification: false });
        syncState();
      },

      getTotal: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getSubtotal: () => {
        const { items } = get();
        return items.reduce(
          (subtotal, item) => subtotal + item.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      getItem: (id) => {
        const { items } = get();
        return items.find((item) => item.id === id);
      },

      isInCart: (id) => {
        const { items } = get();
        return items.some((item) => item.id === id);
      },

      setIsOpen: (isOpen) => set({ isOpen }),

      hideNotification: () => set({ showNotification: false }),
    }),
    {
      name: "codecraft-cart-storage",
      storage: createJSONStorage(() => localStorage),
      // Sincronização entre abas
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.syncState();
        }
      },
    }
  )
);

// NOVO: Listener para sincronização entre abas
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "codecraft-cart-storage") {
      useCartStore.persist.rehydrate();
    }
  });
}
