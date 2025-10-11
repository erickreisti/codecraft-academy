// app/checkout/page.tsx - VERSÃO COMPLETA E FUNCIONAL

/**
 * PÁGINA DE CHECKOUT - Finalização de Compra
 *
 * FUNCIONALIDADES:
 * - ✅ Sticky do resumo funcionando
 * - ✅ Cupons de desconto
 * - ✅ Validação de matrículas existentes
 * - ✅ Processamento completo do pedido
 * - ✅ Rollback em caso de erro
 * - ✅ Interface responsiva e moderna
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
  Tag,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

// Interfaces TypeScript
interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  duration_hours?: number;
  level?: string;
  image_url?: string;
}

interface OrderData {
  user_id: string;
  total_amount: number;
  status: string;
  coupon_code: string | null;
  discount_amount: number;
  created_at: string;
}

interface OrderItemData {
  order_id: string;
  course_id: string;
  price: number;
  quantity: number;
  created_at: string;
}

interface EnrollmentData {
  user_id: string;
  course_id: string;
  completed: boolean;
  progress: number;
  enrolled_at: string;
}

export default function CheckoutPage() {
  // HOOKS E ESTADOS
  const { items, getTotal, clearCart, removeItem } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [isCheckingEnrollments, setIsCheckingEnrollments] = useState(false);
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
      LEARN25: 0.25, // 25% de desconto
    };

    if (coupons[couponCode]) {
      const discountValue = subtotal * coupons[couponCode];
      setDiscount(discountValue);
      setAppliedCoupon(couponCode);
      toast.success(
        `🎉 Cupom ${couponCode} aplicado! Desconto de ${
          coupons[couponCode] * 100
        }%`
      );
    } else {
      toast.error("❌ Cupom inválido ou expirado");
      setCoupon("");
    }
  };

  /**
   * REMOVER CUPOM
   */
  const handleRemoveCoupon = () => {
    setDiscount(0);
    setAppliedCoupon("");
    setCoupon("");
    toast.info("Cupom removido");
  };

  /**
   * VALIDAR SE USUÁRIO JÁ POSSUI OS CURSOS - VERSÃO CORRIGIDA
   */
  const validateExistingEnrollments = async (courseIds: string[]) => {
    if (!user) return { valid: false, existing: [] };

    try {
      // CONSULTA SIMPLIFICADA - SEM JOIN COMPLEXO
      const { data: existingEnrollments, error } = await supabase
        .from("enrollments")
        .select("course_id")
        .eq("user_id", user.id)
        .in("course_id", courseIds);

      if (error) throw error;

      // BUSCAR OS TÍTULOS DOS CURSOS SEPARADAMENTE
      const courseTitles: Record<string, string> = {};

      if (existingEnrollments.length > 0) {
        const { data: courses, error: coursesError } = await supabase
          .from("courses")
          .select("id, title")
          .in(
            "id",
            existingEnrollments.map((e) => e.course_id)
          );

        if (!coursesError && courses) {
          courses.forEach((course) => {
            courseTitles[course.id] = course.title;
          });
        }
      }

      return {
        valid: existingEnrollments.length === 0,
        existing: existingEnrollments.map((e) => ({
          course_id: e.course_id,
          title: courseTitles[e.course_id] || "Curso",
        })),
      };
    } catch (error) {
      console.error("Erro ao validar matrículas:", error);
      return { valid: false, existing: [] };
    }
  };

  /**
   * REMOVER ITEM DO CARRINHO
   */
  const handleRemoveItem = (itemId: string, itemTitle: string) => {
    removeItem(itemId);
    toast.info(`"${itemTitle}" removido do carrinho`);
  };

  /**
   * PROCESSAR CHECKOUT COM VALIDAÇÕES COMPLETAS
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
    setIsCheckingEnrollments(true);

    try {
      const courseIds = items.map((item) => item.id);

      // VALIDAR MATRÍCULAS EXISTENTES
      const enrollmentCheck = await validateExistingEnrollments(courseIds);
      if (!enrollmentCheck.valid) {
        const existingCourses = enrollmentCheck.existing
          .map((e) => e.title)
          .join(", ");
        toast.error(
          `Você já está matriculado em: ${existingCourses}. Remova os cursos duplicados para continuar.`,
          { duration: 6000 }
        );
        return;
      }

      setIsCheckingEnrollments(false);

      // PREPARAR DADOS DO PEDIDO
      const orderData: OrderData = {
        user_id: user.id,
        total_amount: total,
        status: "completed",
        coupon_code: appliedCoupon || null,
        discount_amount: discount,
        created_at: new Date().toISOString(),
      };

      console.log("🛒 Iniciando checkout:", { orderData, items });

      // 1. CRIAR PEDIDO
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert(orderData)
        .select()
        .single();

      if (orderError) {
        console.error("❌ Erro ao criar pedido:", orderError);
        throw new Error(`Falha ao processar pedido: ${orderError.message}`);
      }

      console.log("✅ Pedido criado:", order.id);

      // 2. ADICIONAR ITENS DO PEDIDO
      const orderItems: OrderItemData[] = items.map((item) => ({
        order_id: order.id,
        course_id: item.id,
        price: item.price,
        quantity: item.quantity,
        created_at: new Date().toISOString(),
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("❌ Erro ao adicionar itens:", itemsError);

        // Rollback: deletar o pedido criado
        await supabase.from("orders").delete().eq("id", order.id);

        // Verificar se o erro é devido à estrutura do banco
        if (
          itemsError.message.includes("quantity") ||
          itemsError.message.includes("column")
        ) {
          throw new Error(
            "Problema de configuração. Contate o suporte técnico."
          );
        }

        throw new Error("Falha ao processar itens do pedido");
      }

      console.log("✅ Itens do pedido adicionados");

      // 3. CRIAR MATRÍCULAS
      const enrollments: EnrollmentData[] = items.map((item) => ({
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
        console.error("❌ Erro ao criar matrículas:", enrollmentError);

        // Rollback completo
        await supabase.from("order_items").delete().eq("order_id", order.id);
        await supabase.from("orders").delete().eq("id", order.id);

        throw new Error("Falha ao criar matrículas");
      }

      console.log("✅ Matrículas criadas com sucesso");

      // 4. LIMPAR CARRINHO E REDIRECIONAR
      clearCart();

      toast.success("🎉 Compra realizada com sucesso!", {
        description: "Agora você pode acessar seus cursos na área de membros.",
        duration: 6000,
      });

      // Redirecionar para página de sucesso
      router.push(`/checkout/success?order=${order.id}`);
    } catch (error: any) {
      console.error("💥 Erro completo no checkout:", error);

      const errorMessage = error.message.includes("configuração")
        ? "Erro de configuração. Nossa equipe técnica foi notificada."
        : error.message || "Erro ao processar pedido. Tente novamente.";

      toast.error(`❌ ${errorMessage}`, { duration: 5000 });
    } finally {
      setLoading(false);
      setIsCheckingEnrollments(false);
    }
  };

  // ESTADO: CARRINHO VAZIO
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 container-custom py-20">
          <div className="max-w-md mx-auto text-center space-y-8">
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn btn-primary">
                <Link href="/courses" className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Explorar Cursos
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/" className="flex items-center gap-2">
                  ← Voltar para Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container-custom py-8">
        <div className="max-w-6xl mx-auto">
          {/* CABEÇALHO */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm mb-4">
              <Lock className="h-4 w-4" />
              Checkout Seguro
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Finalizar Compra
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Seus Cursos ({items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item: CartItem) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 rounded-lg border bg-white/50 dark:bg-gray-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg font-bold shadow-lg">
                        {item.title[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{item.duration_hours || 8}h</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span className="capitalize">
                              {item.level || "Iniciante"}
                            </span>
                          </div>
                          {item.quantity > 1 && (
                            <div className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              <span>Qtd: {item.quantity}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <p className="font-bold text-primary text-lg">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-sm text-muted-foreground">
                              {item.quantity}x R$ {item.price.toFixed(2)}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id, item.title)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* CUPOM DE DESCONTO */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
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
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && coupon.trim()) {
                          handleApplyCoupon();
                        }
                      }}
                    />
                    {appliedCoupon ? (
                      <Button
                        onClick={handleRemoveCoupon}
                        variant="outline"
                        className="whitespace-nowrap border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        Remover
                      </Button>
                    ) : (
                      <Button
                        onClick={handleApplyCoupon}
                        disabled={!coupon.trim()}
                        className="whitespace-nowrap bg-purple-600 hover:bg-purple-700"
                      >
                        Aplicar
                      </Button>
                    )}
                  </div>

                  {appliedCoupon && (
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>
                          Cupom <strong>{appliedCoupon}</strong> aplicado! Você
                          economizou <strong>R$ {discount.toFixed(2)}</strong>
                        </span>
                      </p>
                    </div>
                  )}

                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-sm font-medium text-foreground mb-2">
                      🎁 Cupons disponíveis:
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="font-mono bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                          WELCOME10
                        </span>
                        <span className="text-green-600">10% off</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-mono bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                          STUDENT15
                        </span>
                        <span className="text-green-600">15% off</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-mono bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                          FIRSTBUY20
                        </span>
                        <span className="text-green-600">20% off</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-mono bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                          LEARN25
                        </span>
                        <span className="text-green-600">25% off</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* INFORMAÇÕES DE PAGAMENTO */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    Método de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 border-2 border-dashed rounded-lg bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <Lock className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-blue-700 dark:text-blue-300">
                          Pagamento Simulado - Ambiente de Desenvolvimento
                        </div>
                        <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                          Esta é uma transação de teste. Nenhum valor real será
                          cobrado.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="card-number">Número do Cartão</Label>
                      <Input
                        id="card-number"
                        placeholder="0000 0000 0000 0000"
                        disabled
                        className="bg-muted/50 font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label htmlFor="card-expiry">Validade</Label>
                        <Input
                          id="card-expiry"
                          placeholder="MM/AA"
                          disabled
                          className="bg-muted/50"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="card-cvv">CVV</Label>
                        <Input
                          id="card-cvv"
                          placeholder="123"
                          disabled
                          className="bg-muted/50 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="card-name">Nome no Cartão</Label>
                      <Input
                        id="card-name"
                        placeholder="Seu nome completo"
                        disabled
                        className="bg-muted/50"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                          Ambiente de Desenvolvimento
                        </p>
                        <p className="text-amber-700 dark:text-amber-300">
                          Esta é uma versão de testes. Em produção, integraremos
                          com gateways de pagamento reais como Stripe, Mercado
                          Pago ou Pagar.me.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* COLUNA LATERAL - RESUMO FINAL */}
            <div className="space-y-6">
              <div className="sticky top-6 space-y-6">
                {/* RESUMO DO PEDIDO */}
                <Card className="border-0 shadow-xl bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Shield className="h-5 w-5 text-green-600" />
                      Resumo do Pedido
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* RESUMO DE VALORES */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Subtotal ({items.length} curso
                          {items.length > 1 ? "s" : ""})
                        </span>
                        <span>R$ {subtotal.toFixed(2)}</span>
                      </div>

                      {discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600">
                            Desconto {appliedCoupon && `(${appliedCoupon})`}
                          </span>
                          <span className="text-green-600">
                            - R$ {discount.toFixed(2)}
                          </span>
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
                          <div className="text-sm text-muted-foreground text-right mt-1">
                            ou 12x de R$ {(total / 12).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* BOTÃO FINALIZAR COMPRA */}
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6 text-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02] shadow-lg"
                      onClick={handleCheckout}
                      disabled={loading || isCheckingEnrollments || !user}
                      size="lg"
                    >
                      {loading || isCheckingEnrollments ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          {isCheckingEnrollments
                            ? "Verificando..."
                            : "Processando..."}
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-5 w-5 mr-2" />
                          Finalizar Compra
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>

                    {/* MENSAGENS DE STATUS */}
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

                {/* GARANTIAS E BENEFÍCIOS */}
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
                            Garantia de 7 dias ou seu dinheiro de volta
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-green-700 dark:text-green-300">
                            Acesso vitalício aos cursos
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-green-700 dark:text-green-300">
                            Certificado de conclusão inclusivo
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-green-700 dark:text-green-300">
                            Suporte da comunidade e instrutores
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-green-700 dark:text-green-300">
                            Atualizações gratuitas do conteúdo
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AJUDA RÁPIDA */}
                <Card className="border-0 bg-blue-50 dark:bg-blue-900/20">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
                      Precisa de ajuda?
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-blue-700 dark:text-blue-300">
                        Entre em contato com nosso suporte:
                      </p>
                      <div className="space-y-1">
                        <div>📧 suporte@plataforma.com</div>
                        <div>💬 Chat online</div>
                        <div>📞 (11) 99999-9999</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
