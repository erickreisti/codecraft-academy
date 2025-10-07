// components/cart/cart-sidebar.tsx - VERSÃO ÚNICA E CORRIGIDA

/**
 * SIDEBAR DO CARRINHO - Componente de Overlay
 *
 * Sidebar deslizante que mostra:
 * - Lista de itens no carrinho
 * - Controles de quantidade
 * - Resumo de valores
 * - Ações de checkout e limpar carrinho
 *
 * CORREÇÃO: Usando CartItem importado da store
 */

// Diretiva para marcar como componente cliente (Next.js)
"use client";

// Importações de componentes UI personalizados
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Importação da store do carrinho
import { useCartStore } from "@/lib/stores/cart-store";

// Importação de ícones da biblioteca Lucide React
import { Minus, Plus, ShoppingCart, X, Trash2 } from "lucide-react";

// Importação do componente Link do Next.js para navegação
import Link from "next/link";

// Importação da biblioteca de notificações toast
import { toast } from "sonner";

// Importação do componente de imagem segura
import { SafeImage } from "@/components/ui/safe-image";

// CORREÇÃO: Importando CartItem da store
import type { CartItem } from "@/lib/stores/cart-store";

// Componente principal do sidebar do carrinho
export function CartSidebar() {
  // DESTRUTURAÇÃO DA STORE - Obtém estados e métodos da store do carrinho
  const {
    items, // Array de itens no carrinho
    removeItem, // Função para remover item
    updateQuantity, // Função para atualizar quantidade
    getTotal, // Função para calcular total
    getItemCount, // Função para contar itens
    clearCart, // Função para limpar carrinho
    isOpen, // Estado de abertura do sidebar
    setIsOpen, // Função para controlar abertura
  } = useCartStore();

  /**
   * REMOVER ITEM COM FEEDBACK
   */
  const handleRemoveItem = (item: CartItem) => {
    removeItem(item.id); // Remove item da store
    toast.success("Item removido do carrinho", {
      description: `"${item.title}" foi removido.`, // Mensagem descritiva
    });
  };

  /**
   * LIMPAR CARRINHO COMPLETO
   */
  const handleClearCart = () => {
    if (items.length === 0) return; // Evita executar se carrinho já estiver vazio
    clearCart(); // Limpa todos os itens
    toast.info("Carrinho limpo", {
      description: "Todos os itens foram removidos.",
    });
  };

  /**
   * ATUALIZAR QUANTIDADE COM VALIDAÇÃO
   */
  const handleQuantityChange = (id: string, newQuantity: number) => {
    // Se quantidade for menor que 1, remove o item
    if (newQuantity < 1) {
      const itemToRemove = items.find((item) => item.id === id);
      if (itemToRemove) {
        handleRemoveItem(itemToRemove);
      }
      return;
    }
    // Atualiza a quantidade na store
    updateQuantity(id, newQuantity);
  };

  // Renderização do componente
  return (
    // Componente Sheet (sidebar) do Shadcn UI
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {/* Conteúdo do sidebar com classes de estilo */}
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        {/* Cabeçalho do sidebar */}
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" /> {/* Ícone do carrinho */}
            Seu Carrinho
            {/* Badge com contador de itens (só aparece se houver itens) */}
            {getItemCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getItemCount()}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Área principal de conteúdo */}
        <div className="flex-1 flex flex-col">
          {/* CONDICIONAL: Carrinho vazio vs Carrinho com itens */}
          {items.length === 0 ? (
            // ESTADO DE CARRINHO VAZIO
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Carrinho vazio</h3>
              <p className="text-muted-foreground mb-6">
                Adicione cursos incríveis ao seu carrinho!
              </p>
              {/* Botão para explorar cursos */}
              <Button
                onClick={() => setIsOpen(false)}
                asChild
                className="btn btn-primary"
              >
                <Link href="/courses">Explorar Cursos</Link>
              </Button>
            </div>
          ) : (
            // ESTADO DE CARRINHO COM ITENS
            <>
              {/* Área rolável para lista de itens */}
              <ScrollArea className="flex-1">
                <div className="p-6 space-y-4">
                  {/* Mapeia cada item do carrinho */}
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 border rounded-lg p-3 group hover:border-primary/50 transition-colors"
                    >
                      {/* CONTAINER DA IMAGEM */}
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                        {/* Componente de imagem segura com fallback */}
                        <SafeImage
                          src={item.image_url}
                          alt={item.title}
                          width={48}
                          height={48}
                          className="rounded-lg object-cover"
                          fallback={<span className="text-lg">📚</span>} // Fallback emoji
                        />
                      </div>

                      {/* INFORMAÇÕES DO ITEM */}
                      <div className="flex-1 min-w-0 space-y-2">
                        {/* Linha superior: título e botão remover */}
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm line-clamp-2 leading-tight">
                            {item.title}
                          </h4>
                          {/* Botão remover (aparece só no hover) */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveItem(item)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Preço unitário */}
                        <p className="text-sm font-semibold text-primary">
                          R$ {item.price.toFixed(2)}
                        </p>

                        {/* Controles de quantidade e subtotal */}
                        <div className="flex items-center justify-between">
                          {/* CONTROLES DE QUANTIDADE */}
                          <div className="flex items-center gap-1">
                            {/* Botão diminuir */}
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>

                            {/* Quantidade atual */}
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>

                            {/* Botão aumentar */}
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Subtotal do item (preço × quantidade) */}
                          <div className="text-sm font-medium">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* RODAPÉ COM RESUMO E AÇÕES */}
              <div className="border-t p-6 space-y-4 bg-muted/10">
                {/* RESUMO DE VALORES */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Subtotal:</span>
                    <span>R$ {getTotal().toFixed(2)}</span>
                  </div>

                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total:</span>
                      <span className="text-primary">
                        R$ {getTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* BOTÕES DE AÇÃO */}
                <div className="space-y-2">
                  {/* Botão finalizar compra */}
                  <Button className="w-full btn btn-primary" asChild>
                    <Link href="/checkout" onClick={() => setIsOpen(false)}>
                      Finalizar Compra
                    </Link>
                  </Button>

                  {/* Botão limpar carrinho */}
                  <Button
                    variant="outline"
                    className="w-full gap-2 text-muted-foreground hover:text-destructive"
                    onClick={handleClearCart}
                  >
                    <Trash2 className="h-4 w-4" />
                    Limpar Carrinho
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
