// lib/stores/cart-store.ts - VERSÃO CORRIGIDA

/**
 * STORE DO CARRINHO - Gerenciamento de estado global
 *
 * CORREÇÃO: Adicionados os estados e métodos que o CartNotification precisa
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  // NOVOS ESTADOS PARA NOTIFICAÇÕES
  lastAddedItem: CartItem | null;
  showNotification: boolean;

  // MÉTODOS PRINCIPAIS
  addItem: (course: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  setIsOpen: (isOpen: boolean) => void;

  // MÉTODOS UTILITÁRIOS
  getItem: (id: string) => CartItem | undefined;
  isInCart: (id: string) => boolean;
  getSubtotal: () => number;

  // NOVO MÉTODO PARA NOTIFICAÇÕES
  hideNotification: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      // INICIALIZA OS NOVOS ESTADOS
      lastAddedItem: null,
      showNotification: false,

      addItem: (course) => {
        const { items } = get();
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

        // ATUALIZA COM OS NOVOS ESTADOS DE NOTIFICAÇÃO
        set({
          items: newItems,
          lastAddedItem: addedItem || null,
          showNotification: true,
          isOpen: true,
        });

        // Auto-esconde a notificação após 3 segundos
        setTimeout(() => {
          get().hideNotification();
        }, 3000);
      },

      removeItem: (id) => {
        const { items } = get();
        set({ items: items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        const { items } = get();
        set({
          items: items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [], showNotification: false }),

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

      // NOVO MÉTODO: ESCONDE NOTIFICAÇÃO
      hideNotification: () => set({ showNotification: false }),
    }),
    {
      name: "codecraft-cart-storage",
      partialize: (state) => ({
        items: state.items,
        // Não persistir estados temporários de notificação
      }),
    }
  )
);
