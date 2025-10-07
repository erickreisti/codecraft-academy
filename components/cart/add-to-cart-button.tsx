// components/cart/add-to-cart-button.tsx

/**
 * BOTÃO ADICIONAR AO CARRINHO
 *
 * Componente inteligente que:
 * - Mostra estado atual do curso no carrinho
 * - Gerencia loading durante a adição
 * - Feedback visual com estados diferentes
 * - Integração com Sonner para notificações
 */

"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/stores/cart-store";
import { Course } from "@/types";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AddToCartButtonProps {
  course: Course;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function AddToCartButton({
  course,
  variant = "default",
  size = "default",
  className = "",
}: AddToCartButtonProps) {
  const { addItem, isInCart } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  /**
   * HANDLE ADD TO CART
   * Gerencia o processo de adicionar curso ao carrinho
   * Inclui loading state e notificação de sucesso
   */
  const handleAddToCart = async () => {
    // Validações iniciais
    if (isInCart(course.id) || course.price === 0) return;

    setIsAdding(true);

    // Simula delay para melhor UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Adiciona ao carrinho
    addItem({
      id: course.id,
      title: course.title,
      price: course.price,
      image_url: course.image_url,
      slug: course.slug,
    });

    // Notificação de sucesso
    toast.success("Curso adicionado ao carrinho!", {
      description: `"${course.title}" foi adicionado com sucesso.`,
      action: {
        label: "Ver Carrinho",
        onClick: () => window.open("/cart", "_blank"),
      },
    });

    setIsAdding(false);
  };

  // CASO 1: Curso gratuito - Redireciona direto para o curso
  if (course.price === 0) {
    return (
      <Button
        variant="outline"
        size={size}
        className={`w-full gap-2 ${className}`}
        asChild
      >
        <a href={`/courses/${course.slug}`}>
          <Check className="h-4 w-4" />
          Acessar Gratuito
        </a>
      </Button>
    );
  }

  // CASO 2: Já está no carrinho - Botão desabilitado
  if (isInCart(course.id)) {
    return (
      <Button
        variant="outline"
        size={size}
        className={`w-full gap-2 bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300 ${className}`}
        disabled
      >
        <Check className="h-4 w-4" />
        No Carrinho
      </Button>
    );
  }

  // CASO 3: Disponível para adicionar - Botão ativo
  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`w-full gap-2 ${className}`}
    >
      {isAdding ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ShoppingCart className="h-4 w-4" />
      )}
      {isAdding ? "Adicionando..." : "Adicionar ao Carrinho"}
    </Button>
  );
}
