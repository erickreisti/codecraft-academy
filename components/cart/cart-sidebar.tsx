// components/cart/cart-sidebar.tsx
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
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import Link from "next/link";

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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
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
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Carrinho vazio</h3>
              <p className="text-muted-foreground mb-6">
                Adicione cursos incríveis ao seu carrinho!
              </p>
              <Button onClick={() => setIsOpen(false)} asChild>
                <Link href="/courses">Explorar Cursos</Link>
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 py-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 border rounded-lg p-3"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          R$ {item.price.toFixed(2)}
                        </p>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
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
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span>R$ {getTotal().toFixed(2)}</span>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" asChild>
                    <Link href="/checkout">Finalizar Compra</Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={clearCart}
                  >
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
