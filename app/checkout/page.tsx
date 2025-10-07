// app/checkout/page.tsx - VERSÃO FINAL CORRIGIDA

/**
 * PÁGINA DE CHECKOUT - Finalização de Compra
 *
 * CORREÇÕES APLICADAS:
 * - ✅ Removidos imports não utilizados
 * - ✅ Removidas variáveis não utilizadas
 * - ✅ Corrigido useEffect dependency
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
import { supabase } from "@/lib/supabase/client";

export default function CheckoutPage() {
  // HOOKS E ESTADOS
  const { items, getTotal, clearCart } = useCartStore(); // REMOVIDO: getItemCount não usado
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
   */
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getUser();
  }, []); // CORREÇÃO: Removido supabase.auth das dependências

  /**
   * APLICAR CUPOM DE DESCONTO
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

  // CHECKOUT PRINCIPAL
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          {/* CABEÇALHO */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Finalizar Compra</h1>
            <p className="text-muted-foreground mt-2">
              Revise seus itens e complete seu pedido
            </p>
          </div>

          {/* LAYOUT EM DUAS COLUNAS */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* COLUNA PRINCIPAL */}
            <div className="lg:col-span-2 space-y-6">
              {/* RESUMO DO PEDIDO */}
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2 border-b"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Quantidade: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* CUPOM DE DESCONTO */}
              <Card>
                <CardHeader>
                  <CardTitle>Cupom de Desconto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Digite seu cupom"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyCoupon}
                      disabled={!coupon.trim()}
                    >
                      Aplicar
                    </Button>
                  </div>
                  {discount > 0 && (
                    <p className="text-sm text-green-600 mt-2">
                      Cupom aplicado! Desconto: R$ {discount.toFixed(2)}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* INFORMAÇÕES DE PAGAMENTO (SIMULADO) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/20">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Lock className="h-4 w-4" />
                      <span>Pagamento simulado - Em desenvolvimento</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Número do Cartão</Label>
                    <Input placeholder="**** **** **** ****" disabled />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label>Validade</Label>
                      <Input placeholder="MM/AA" disabled />
                    </div>
                    <div className="space-y-3">
                      <Label>CVV</Label>
                      <Input placeholder="***" disabled />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* COLUNA LATERAL - RESUMO FINAL */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Resumo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({items.length} itens)</span>
                      <span>R$ {subtotal.toFixed(2)}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Desconto</span>
                        <span>- R$ {discount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-primary">
                          R$ {total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BOTÃO FINALIZAR COMPRA */}
                  <Button
                    className="w-full btn btn-primary"
                    onClick={handleCheckout}
                    disabled={loading || !user}
                    size="lg"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CreditCard className="h-4 w-4 mr-2" />
                    )}
                    {loading ? "Processando..." : "Finalizar Compra"}
                  </Button>

                  {/* MENSAGEM PARA USUÁRIO NÃO LOGADO */}
                  {!user && (
                    <p className="text-sm text-center text-muted-foreground">
                      <Link
                        href="/login?redirect=/checkout"
                        className="text-primary hover:underline"
                      >
                        Faça login
                      </Link>{" "}
                      para finalizar a compra
                    </p>
                  )}

                  {/* INDICADOR DE SEGURANÇA */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    <span>Pagamento 100% seguro</span>
                  </div>
                </CardContent>
              </Card>

              {/* GARANTIAS E BENEFÍCIOS */}
              <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">
                        Garantia de 7 dias
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">
                        Acesso vitalício
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />

                      <span className="text-sm font-medium">
                        Certificado inclusivo
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
