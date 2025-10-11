// components/cart/add-to-cart-button.tsx - ARQUIVO COMPLETO CORRIGIDO
"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/stores/cart-store";
import { Course } from "@/types";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

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

    // Simular delay de processamento
    await new Promise((resolve) => setTimeout(resolve, 500));

    addItem({
      id: course.id,
      title: course.title,
      price: course.price,
      image_url: course.image_url || undefined,
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

  // Curso gratuito - redireciona para a página do curso
  if (course.price === 0) {
    return (
      <Button
        variant="outline"
        size={size}
        className={`w-full gap-2 ${className}`}
        asChild
      >
        <Link href={`/courses/${course.slug}`}>
          <Check className="h-4 w-4" />
          Acessar Gratuito
        </Link>
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

  // Disponível para adicionar ao carrinho
  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`w-full gap-2 ${className}`}
    >
      {isAdding ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Adicionando...
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          Adicionar ao Carrinho
        </>
      )}
    </Button>
  );
}
