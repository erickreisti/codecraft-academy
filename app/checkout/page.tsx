// app/checkout/page.tsx - VERSÃO CORRIGIDA COM STICKY FUNCIONAL

/**
 * PÁGINA DE CHECKOUT - Finalização de Compra
 *
 * CORREÇÕES APLICADAS:
 * - ✅ Sticky do resumo funcionando corretamente
 * - ✅ Tipos TypeScript corrigidos
 * - ✅ Interface CartItem atualizada
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
import { Footer } from "@/components/layout/footer";
import {
  Loader2,
  CreditCard,
  Lock,
  CheckCircle2,
  Shield,
  Sparkles,
  BookOpen,
  Clock,
  Users,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function CheckoutPage() {
  // HOOKS E ESTADOS
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const router = useRouter();

  // CÁLCULOS DE VALORES
  const subtotal = getTotal();
  const total = Math.max(0, subtotal - discount);

  /**
   * EFFECT PARA BUSCAR USUÁRIO LOGADO
   */
  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        toast.error("Erro ao carregar dados do usuário");
      }
    };
    getUser();
  }, []);

  /**
   * APLICAR CUPOM DE DESCONTO
   */
  const handleApplyCoupon = () => {
    const couponCode = coupon.trim().toUpperCase();

    const coupons: Record<string, number> = {
      WELCOME10: 0.1, // 10% de desconto
      STUDENT15: 0.15, // 15% de desconto
      FIRSTBUY20: 0.2, // 20% de desconto
    };

    if (coupons[couponCode]) {
      const discountValue = subtotal * coupons[couponCode];
      setDiscount(discountValue);
      setAppliedCoupon(couponCode);
      toast.success(
        `Cupom ${couponCode} aplicado! Desconto de ${
          coupons[couponCode] * 100
        }%`
      );
    } else {
      toast.error("Cupom inválido ou expirado");
      setCoupon("");
    }
  };

  /**
   * VALIDAR SE USUÁRIO JÁ POSSUI OS CURSOS
   */
  const validateExistingEnrollments = async (courseIds: string[]) => {
    if (!user) return { valid: false, existing: [] };

    try {
      const { data: existingEnrollments, error } = await supabase
        .from("enrollments")
        .select("course_id")
        .eq("user_id", user.id)
        .in("course_id", courseIds);

      if (error) throw error;

      return {
        valid: existingEnrollments.length === 0,
        existing: existingEnrollments.map((e) => e.course_id),
      };
    } catch (error) {
      console.error("Erro ao validar matrículas:", error);
      return { valid: false, existing: [] };
    }
  };

  /**
   * PROCESSAR CHECKOUT COM VALIDAÇÕES
   */
  const handleCheckout = async () => {
    // VALIDAÇÕES INICIAIS
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
      const courseIds = items.map((item) => item.id);

      // VALIDAR MATRÍCULAS EXISTENTES
      const enrollmentCheck = await validateExistingEnrollments(courseIds);
      if (!enrollmentCheck.valid) {
        toast.error(
          "Você já possui alguns cursos do carrinho. Remova-os para continuar."
        );
        setLoading(false);
        return;
      }

      // INICIAR TRANSAÇÃO
      const orderData = {
        user_id: user.id,
        total_amount: total,
        status: "completed",
        coupon_code: appliedCoupon || null,
        discount_amount: discount,
      };

      // 1. CRIAR PEDIDO
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert(orderData)
        .select()
        .single();

      if (orderError) {
        console.error("Erro ao criar pedido:", orderError);
        throw new Error("Falha ao processar pedido");
      }

      // 2. ADICIONAR ITENS DO PEDIDO
      const orderItems = items.map((item) => ({
        order_id: order.id,
        course_id: item.id,
        price: item.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("Erro ao adicionar itens:", itemsError);
        throw new Error("Falha ao processar itens do pedido");
      }

      // 3. CRIAR MATRÍCULAS
      const enrollments = items.map((item) => ({
        user_id: user.id,
        course_id: item.id,
        completed: false,
        progress: 0,
        enrolled_at: new Date().toISOString(),
      }));

      const { error: enrollmentError } = await supabase
        .from("enrollments")
        .insert(enrollments);

      if (enrollmentError) {
        console.error("Erro ao criar matrículas:", enrollmentError);
        throw new Error("Falha ao criar matrículas");
      }

      // 4. LIMPAR CARRINHO E REDIRECIONAR
      clearCart();

      toast.success("Compra realizada com sucesso!", {
        description: "Agora você pode acessar seus cursos.",
        duration: 5000,
      });

      // Redirecionar para página de sucesso
      router.push(`/checkout/success?order=${order.id}`);
    } catch (error: any) {
      console.error("Erro no checkout:", error);
      toast.error(
        error.message || "Erro ao processar pedido. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  // ESTADO: CARRINHO VAZIO
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-custom py-20 text-center">
          <div className="max-w-md mx-auto space-y-8">
            <div className="w-32 h-32 mx-auto bg-muted rounded-full flex items-center justify-center">
              <CreditCard className="h-16 w-16 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-foreground">
                Carrinho vazio
              </h1>
              <p className="text-xl text-muted-foreground">
                Adicione alguns cursos incríveis antes de finalizar a compra.
              </p>
            </div>
            <Button asChild className="btn btn-primary">
              <Link href="/courses" className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Explorar Cursos
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container-custom py-8">
        <div className="max-w-6xl mx-auto">
          {/* CABEÇALHO */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Finalizar Compra</h1>
            <p className="text-xl text-muted-foreground">
              Revise seus cursos e complete seu pedido com segurança
            </p>
          </div>

          {/* LAYOUT EM DUAS COLUNAS */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* COLUNA PRINCIPAL */}
            <div className="lg:col-span-2 space-y-6">
              {/* RESUMO DO PEDIDO */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <BookOpen className="h-5 w-5" />
                    Seus Cursos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 rounded-lg border bg-white/50 dark:bg-gray-800/50"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg font-bold">
                        {item.title[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{item.duration_hours || 8}h</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{item.level || "Iniciante"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary text-lg">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity}x R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* CUPOM DE DESCONTO */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Cupom de Desconto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Digite seu cupom (ex: WELCOME10)"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="flex-1"
                      disabled={!!appliedCoupon}
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={!coupon.trim() || !!appliedCoupon}
                      variant={appliedCoupon ? "outline" : "default"}
                      className="whitespace-nowrap"
                    >
                      {appliedCoupon ? "Aplicado" : "Aplicar"}
                    </Button>
                  </div>
                  {appliedCoupon && (
                    <p className="text-sm text-green-600 mt-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Cupom <strong>{appliedCoupon}</strong> aplicado! Você
                      economizou R$ {discount.toFixed(2)}
                    </p>
                  )}
                  <div className="mt-3 text-xs text-muted-foreground">
                    <p>
                      Cupons disponíveis: WELCOME10 (10%), STUDENT15 (15%),
                      FIRSTBUY20 (20%)
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* INFORMAÇÕES DE PAGAMENTO */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Método de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 border-2 border-dashed rounded-lg bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3 text-sm">
                      <Lock className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-blue-700 dark:text-blue-300">
                          Pagamento Simulado
                        </div>
                        <div className="text-blue-600 dark:text-blue-400">
                          Sistema em desenvolvimento - Transação segura
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="space-y-3">
                      <Label>Número do Cartão</Label>
                      <Input
                        placeholder="0000 0000 0000 0000"
                        disabled
                        className="bg-muted/50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label>Validade</Label>
                        <Input
                          placeholder="MM/AA"
                          disabled
                          className="bg-muted/50"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label>CVV</Label>
                        <Input
                          placeholder="123"
                          disabled
                          className="bg-muted/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Nome no Cartão</Label>
                      <Input
                        placeholder="Seu nome completo"
                        disabled
                        className="bg-muted/50"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* COLUNA LATERAL - RESUMO FINAL */}
            <div className="space-y-6">
              {/* WRAPPER PARA STICKY FUNCIONAL */}
              <div className="sticky top-6 space-y-6">
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      Resumo do Pedido
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* RESUMO DE VALORES */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>
                          Subtotal ({items.length} curso
                          {items.length > 1 ? "s" : ""})
                        </span>
                        <span>R$ {subtotal.toFixed(2)}</span>
                      </div>

                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>
                            Desconto {appliedCoupon && `(${appliedCoupon})`}
                          </span>
                          <span>- R$ {discount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="border-t pt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span className="text-primary text-xl">
                            R$ {total.toFixed(2)}
                          </span>
                        </div>
                        {total > 0 && (
                          <div className="text-sm text-muted-foreground text-right">
                            ou 12x de R$ {(total / 12).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* BOTÃO FINALIZAR COMPRA */}
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6 text-lg transition-all duration-300 hover:scale-105"
                      onClick={handleCheckout}
                      disabled={loading || !user}
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-5 w-5 mr-2" />
                          Finalizar Compra
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>

                    {/* MENSAGEM PARA USUÁRIO NÃO LOGADO */}
                    {!user && (
                      <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          <Link
                            href="/login?redirect=/checkout"
                            className="font-semibold underline hover:no-underline"
                          >
                            Faça login
                          </Link>{" "}
                          para finalizar a compra
                        </p>
                      </div>
                    )}

                    {/* SEGURANÇA */}
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-4 border-t">
                      <Lock className="h-3 w-3" />
                      <span>Pagamento 100% seguro e criptografado</span>
                    </div>
                  </CardContent>
                </Card>

                {/* GARANTIAS */}
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        Sua Compra Protegida
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-green-700 dark:text-green-300">
                            Garantia de 7 dias
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-green-700 dark:text-green-300">
                            Acesso vitalício
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-green-700 dark:text-green-300">
                            Certificado inclusivo
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-green-700 dark:text-green-300">
                            Suporte da comunidade
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
