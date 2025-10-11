"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore } from "@/lib/stores/cart-store";
import {
  Minus,
  Plus,
  ShoppingCart,
  X,
  Trash2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { CourseImage } from "@/components/ui/course-image";

export function CartSidebar() {
  const {
    items,
    removeItem,
    updateQuantity,
    getTotal,
    getItemCount,
    clearCart,
    isOpen,
    setIsOpen,
  } = useCartStore();

  const handleRemoveItem = (item: any) => {
    removeItem(item.id);
    toast.success("Item removido do carrinho", {
      description: `${item.title} foi removido`,
    });
  };

  const handleClearCart = () => {
    if (items.length === 0) return;
    clearCart();
    toast.info("Carrinho limpo", {
      description: "Todos os itens foram removidos",
    });
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      const itemToRemove = items.find((item: any) => item.id === id);
      if (itemToRemove) handleRemoveItem(itemToRemove);
      return;
    }
    updateQuantity(id, newQuantity);
  };

  const getDiscount = () => {
    const total = getTotal();
    if (items.length >= 2) {
      return total * 0.1; // 10% de desconto para 2+ cursos
    }
    return 0;
  };

  const getFinalTotal = () => {
    return getTotal() - getDiscount();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        className="w-full sm:max-w-md flex flex-col p-0 bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60"
        aria-describedby="cart-description"
      >
        <div id="cart-description" className="sr-only">
          Sidebar do carrinho de compras contendo itens selecionados, resumo do
          pedido e opções de finalização
        </div>
        <SheetHeader className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/20">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-foreground">
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {getItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    {getItemCount()}
                  </span>
                )}
              </div>
              Seu Carrinho
            </SheetTitle>
            {items.length > 0 && (
              <Badge variant="secondary" className="animate-pulse">
                {items.length} {items.length === 1 ? "curso" : "cursos"}
              </Badge>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 flex flex-col">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="relative mb-6">
                <ShoppingCart className="h-20 w-20 text-muted-foreground/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-muted-foreground/60 animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                Carrinho vazio
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm leading-relaxed">
                Explore nossos cursos incríveis e comece sua jornada de
                aprendizado!
              </p>
              <div className="space-y-3 w-full max-w-xs">
                <Button
                  onClick={() => setIsOpen(false)}
                  asChild
                  className="w-full btn btn-primary gap-2"
                >
                  <Link href="/courses">
                    <Sparkles className="h-4 w-4" />
                    Explorar Cursos
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  Continuar Navegando
                </Button>
              </div>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                  {items.map((item: any) => (
                    <div
                      key={item.id}
                      className="group relative bg-card border rounded-xl p-4 hover:border-primary/30 hover:shadow-md transition-all duration-300"
                    >
                      {/* Botão de remover no canto superior direito */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 bg-background border rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground hover:scale-110 z-10"
                        onClick={() => handleRemoveItem(item)}
                      >
                        <X className="h-3 w-3" />
                      </Button>

                      <div className="flex items-start gap-4">
                        {/* Miniatura da imagem - CORRIGIDA */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-lg overflow-hidden border bg-muted/50 group-hover:border-primary/50 transition-colors">
                            {item.image_url ? (
                              <CourseImage
                                src={item.image_url}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                  {item.title[0]?.toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Conteúdo do curso */}
                        <div className="flex-1 min-w-0 space-y-3">
                          <div className="space-y-1">
                            <h4 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                              {item.title}
                            </h4>
                            {item.category && (
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            {/* Controles de quantidade */}
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-lg"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium w-6 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-lg"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            {/* Preços */}
                            <div className="text-right space-y-1">
                              <p className="text-sm font-semibold text-primary">
                                R$ {item.price.toFixed(2)}
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-xs text-muted-foreground">
                                  R$ {(item.price * item.quantity).toFixed(2)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Resumo do pedido */}
              <div className="border-t bg-gradient-to-t from-background to-muted/5 p-6 space-y-4">
                {/* Cupom de desconto */}
                {items.length >= 2 && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Sparkles className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-700 dark:text-green-300">
                        Pacote de Cursos!
                      </span>
                      <Badge
                        variant="outline"
                        className="text-xs bg-green-500/10 text-green-700 dark:text-green-300 border-green-300"
                      >
                        10% OFF
                      </Badge>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Desconto aplicado para 2+ cursos
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>R$ {getTotal().toFixed(2)}</span>
                  </div>

                  {/* Desconto */}
                  {getDiscount() > 0 && (
                    <div className="flex justify-between items-center text-sm text-green-600 dark:text-green-400">
                      <span>Desconto (10%):</span>
                      <span>- R$ {getDiscount().toFixed(2)}</span>
                    </div>
                  )}

                  {/* Total */}
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        R$ {getFinalTotal().toFixed(2)}
                      </span>
                    </div>
                    {getDiscount() > 0 && (
                      <p className="text-xs text-muted-foreground text-right mt-1">
                        Você economizou R$ {getDiscount().toFixed(2)}!
                      </p>
                    )}
                  </div>
                </div>

                {/* Ações */}
                <div className="space-y-3 pt-2">
                  <Button
                    className="w-full btn btn-primary gap-3 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    asChild
                  >
                    <Link
                      href="/checkout"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center"
                    >
                      <Sparkles className="h-5 w-5" />
                      Finalizar Compra
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 gap-2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Continuar Comprando
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                      onClick={handleClearCart}
                      size="icon"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Benefícios */}
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-3 gap-4 text-center text-xs text-muted-foreground">
                    <div className="space-y-1">
                      <div className="w-6 h-6 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400">
                          🔒
                        </span>
                      </div>
                      <span>Compra Segura</span>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <span className="text-green-600 dark:text-green-400">
                          ⚡
                        </span>
                      </div>
                      <span>Acesso Imediato</span>
                    </div>
                    <div className="space-y-1">
                      <div className="w-6 h-6 mx-auto bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 dark:text-purple-400">
                          🎓
                        </span>
                      </div>
                      <span>Certificado</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
