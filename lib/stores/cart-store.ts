// lib/stores/cart-store.ts - VERSÃO CORRIGIDA

/**
 * STORE DO CARRINHO - Gerenciamento de estado global
 *
 * CORREÇÃO: Exportando o tipo CartItem para uso em outros componentes
 */

// Importa a função create do Zustand para criar a store
import { create } from "zustand";
// Importa o middleware persist para salvar o estado no localStorage
import { persist } from "zustand/middleware";

// CORREÇÃO: Exportando a interface CartItem
// Define a interface para um item do carrinho
export interface CartItem {
  id: string; // ID único do curso
  title: string; // Título do curso
  price: number; // Preço do curso
  image_url?: string; // URL da imagem (opcional)
  slug: string; // Slug para URLs amigáveis
  quantity: number; // Quantidade no carrinho
}

// Interface que define o formato completo da store
interface CartStore {
  items: CartItem[]; // Array de itens no carrinho
  isOpen: boolean; // Estado de abertura/fechamento do carrinho

  // NOVOS ESTADOS PARA NOTIFICAÇÕES
  lastAddedItem: CartItem | null; // Último item adicionado (para notificação)
  showNotification: boolean; // Controla se mostra notificação

  // MÉTODOS PRINCIPAIS
  addItem: (course: Omit<CartItem, "quantity">) => void; // Adiciona item ao carrinho
  removeItem: (id: string) => void; // Remove item pelo ID
  updateQuantity: (id: string, quantity: number) => void; // Atualiza quantidade
  clearCart: () => void; // Limpa todo o carrinho
  getTotal: () => number; // Calcula total
  getItemCount: () => number; // Conta total de itens
  setIsOpen: (isOpen: boolean) => void; // Controla abertura/fechamento

  // MÉTODOS UTILITÁRIOS
  getItem: (id: string) => CartItem | undefined; // Busca item por ID
  isInCart: (id: string) => boolean; // Verifica se item está no carrinho
  getSubtotal: () => number; // Calcula subtotal

  // MÉTODO PARA NOTIFICAÇÕES
  hideNotification: () => void; // Esconde notificação
}

// Cria e exporta a store usando create do Zustand com persistência
export const useCartStore = create<CartStore>()(
  // Aplica middleware de persistência
  persist(
    // Função que define o estado e ações da store
    (set, get) => ({
      // ESTADO INICIAL
      items: [], // Carrinho vazio inicialmente
      isOpen: false, // Carrinho fechado inicialmente
      lastAddedItem: null, // Nenhum item adicionado ainda
      showNotification: false, // Notificação oculta inicialmente

      // AÇÃO: Adicionar item ao carrinho
      addItem: (course) => {
        const { items } = get(); // Obtém estado atual dos itens

        // Verifica se o item já existe no carrinho
        const existingItem = items.find((item) => item.id === course.id);

        let newItems: CartItem[];

        // Se o item já existe, incrementa a quantidade
        if (existingItem) {
          newItems = items.map((item) =>
            item.id === course.id
              ? { ...item, quantity: item.quantity + 1 } // Incrementa quantidade
              : item
          );
        } else {
          // Se é um novo item, adiciona com quantidade 1
          newItems = [...items, { ...course, quantity: 1 }];
        }

        // Encontra o item que foi adicionado/atualizado
        const addedItem = newItems.find((item) => item.id === course.id);

        // Atualiza o estado com os novos valores
        set({
          items: newItems, // Atualiza lista de itens
          lastAddedItem: addedItem || null, // Define último item adicionado
          showNotification: true, // Mostra notificação
          isOpen: true, // Abre o carrinho
        });

        // Configura timeout para esconder notificação após 3 segundos
        setTimeout(() => {
          get().hideNotification(); // Chama método para esconder notificação
        }, 3000);
      },

      // AÇÃO: Remove item do carrinho pelo ID
      removeItem: (id) => {
        const { items } = get();
        // Filtra removendo o item com ID especificado
        set({ items: items.filter((item) => item.id !== id) });
      },

      // AÇÃO: Atualiza quantidade de um item
      updateQuantity: (id, quantity) => {
        // Se quantidade for menor ou igual a zero, remove o item
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        const { items } = get();
        // Atualiza a quantidade do item específico
        set({
          items: items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      // AÇÃO: Limpa todo o carrinho
      clearCart: () => set({ items: [], showNotification: false }),

      // MÉTODO: Calcula o valor total do carrinho
      getTotal: () => {
        const { items } = get();
        // Soma: preço * quantidade de cada item
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      // MÉTODO: Calcula subtotal (mesmo que total neste caso)
      getSubtotal: () => {
        const { items } = get();
        return items.reduce(
          (subtotal, item) => subtotal + item.price * item.quantity,
          0
        );
      },

      // MÉTODO: Conta o número total de itens no carrinho
      getItemCount: () => {
        const { items } = get();
        // Soma as quantidades de todos os itens
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      // MÉTODO: Busca um item específico pelo ID
      getItem: (id) => {
        const { items } = get();
        return items.find((item) => item.id === id);
      },

      // MÉTODO: Verifica se um item está no carrinho
      isInCart: (id) => {
        const { items } = get();
        return items.some((item) => item.id === id);
      },

      // AÇÃO: Controla se o carrinho está aberto ou fechado
      setIsOpen: (isOpen) => set({ isOpen }),

      // AÇÃO: Esconde a notificação
      hideNotification: () => set({ showNotification: false }),
    }),
    {
      // CONFIGURAÇÃO DA PERSISTÊNCIA
      name: "codecraft-cart-storage", // Nome da chave no localStorage
      partialize: (state) => ({
        items: state.items, // Apenas os itens são persistidos
      }),
    }
  )
);
