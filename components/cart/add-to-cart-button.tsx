// components/cart/add-to-cart-button.tsx - VERSÃO CORRIGIDA

/**
 * BOTÃO ADICIONAR AO CARRINHO
 *
 * CORREÇÃO: Tipagem do image_url para aceitar string | null
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

  const handleAddToCart = async () => {
    if (isInCart(course.id) || course.price === 0) return;

    setIsAdding(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    // CORREÇÃO: Converter null para undefined
    addItem({
      id: course.id,
      title: course.title,
      price: course.price,
      image_url: course.image_url || undefined, // Converte null para undefined
      slug: course.slug,
    });

    toast.success("Curso adicionado ao carrinho!", {
      description: `"${course.title}" foi adicionado com sucesso.`,
      action: {
        label: "Ver Carrinho",
        onClick: () => window.open("/cart", "_blank"),
      },
    });

    setIsAdding(false);
  };

  // Curso gratuito
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

  // Já está no carrinho
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

  // Disponível para adicionar
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
