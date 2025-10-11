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
import { Minus, Plus, ShoppingCart, X, Trash2 } from "lucide-react";
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
    toast.success("Item removido do carrinho");
  };

  const handleClearCart = () => {
    if (items.length === 0) return;
    clearCart();
    toast.info("Carrinho limpo");
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      const itemToRemove = items.find((item: any) => item.id === id);
      if (itemToRemove) handleRemoveItem(itemToRemove);
      return;
    }
    updateQuantity(id, newQuantity);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Seu Carrinho
            {getItemCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getItemCount()}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 flex flex-col">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Carrinho vazio</h3>
              <p className="text-muted-foreground mb-6">
                Adicione cursos incríveis ao seu carrinho!
              </p>
              <Button
                onClick={() => setIsOpen(false)}
                asChild
                className="btn btn-primary"
              >
                <Link href="/courses">Explorar Cursos</Link>
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1">
                <div className="p-6 space-y-4">
                  {items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 border rounded-lg p-3 group hover:border-primary/50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden">
                        <CourseImage
                          src={item.image_url}
                          alt={item.title}
                          className="w-12 h-12"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm line-clamp-2 leading-tight">
                            {item.title}
                          </h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveItem(item)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm font-semibold text-primary">
                          R$ {item.price.toFixed(2)}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
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
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
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
                          <div className="text-sm font-medium">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t p-6 space-y-4 bg-muted/10">
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

                <div className="space-y-2">
                  <Button className="w-full btn btn-primary" asChild>
                    <Link href="/checkout" onClick={() => setIsOpen(false)}>
                      Finalizar Compra
                    </Link>
                  </Button>
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
