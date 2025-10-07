// app/checkout/page.tsx - VERSÃO FINAL CORRIGIDA

/**
 * PÁGINA DE CHECKOUT - Finalização de Compra
 *
 * CORREÇÕES APLICADAS:
 * - ✅ Usando cliente Supabase configurado corretamente
 * - ✅ Tipo User correto do @supabase/supabase-js
 * - ✅ Import do cliente do arquivo de configuração
 */

"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { useCartStore } from "@/lib/stores/cart-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/layout/header";
import { Loader2, CreditCard, Lock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client"; // CORREÇÃO: Import do cliente configurado

export default function CheckoutPage() {
  // HOOKS E ESTADOS
  const { items, getTotal, clearCart, getItemCount } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const router = useRouter();

  // CÁLCULOS DE VALORES
  const subtotal = getTotal();
  const total = subtotal - discount;

  /**
   * EFFECT PARA BUSCAR USUÁRIO LOGADO
   * Verifica se há sessão ativa ao carregar a página
   */
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getUser();
  }, [supabase.auth]);

  /**
   * APLICAR CUPOM DE DESCONTO
   * Simulação de sistema de cupons
   */
  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === "WELCOME10") {
      setDiscount(subtotal * 0.1);
      toast.success("Cupom aplicado com sucesso!");
    } else {
      toast.error("Cupom inválido");
    }
  };

  /**
   * PROCESSAR CHECKOUT
   * Fluxo completo de finalização de compra
   */
  const handleCheckout = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para finalizar a compra");
      router.push("/login?redirect=/checkout");
      return;
    }

    if (items.length === 0) {
      toast.error("Seu carrinho está vazio");
      return;
    }

    setLoading(true);

    try {
      // 1. CRIAR PEDIDO NO BANCO
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: total,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. ADICIONAR ITENS DO PEDIDO
      const orderItems = items.map((item) => ({
        order_id: order.id,
        course_id: item.id,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. CRIAR MATRÍCULAS NOS CURSOS
      const enrollments = items.map((item) => ({
        user_id: user.id,
        course_id: item.id,
        completed: false,
        progress: 0,
      }));

      const { error: enrollmentError } = await supabase
        .from("enrollments")
        .insert(enrollments);

      if (enrollmentError) throw enrollmentError;

      // 4. LIMPAR CARRINHO E MOSTRAR SUCESSO
      clearCart();

      toast.success("Compra realizada com sucesso!", {
        description: "Agora você pode acessar seus cursos.",
        action: {
          label: "Ver Cursos",
          onClick: () => router.push("/dashboard/courses"),
        },
      });

      router.push(`/checkout/success?order=${order.id}`);
    } catch (error) {
      console.error("Erro no checkout:", error);
      toast.error("Erro ao processar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // ESTADO: CARRINHO VAZIO
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-custom py-16 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-6xl">🛒</div>
            <h1 className="text-2xl font-bold">Carrinho vazio</h1>
            <p className="text-muted-foreground">
              Adicione alguns cursos antes de finalizar a compra.
            </p>
            <Button asChild className="btn btn-primary">
              <Link href="/courses">Explorar Cursos</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // CHECKOUT PRINCIPAL (o restante do código permanece igual)
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Finalizar Compra</h1>
            <p className="text-muted-foreground mt-2">
              Revise seus itens e complete seu pedido
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* ... resto do código permanece igual ... */}
          </div>
        </div>
      </div>
    </div>
  );
}
