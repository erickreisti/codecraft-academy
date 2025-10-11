// app/checkout/success/page.tsx - VERSÃO MELHORADA
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  CheckCircle2,
  Download,
  Mail,
  ArrowRight,
  BookOpen,
  Clock,
  Users,
  Sparkles,
  Rocket,
  Gift,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

interface OrderDetails {
  id: string;
  total_amount: number;
  created_at: string;
  order_items: Array<{
    courses: {
      title: string;
      slug: string;
      duration_hours?: number;
      level?: string;
    };
  }>;
}

export default function CheckoutSuccessPage() {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  useEffect(() => {
    const fetchOrderAndUser = async () => {
      if (!orderId) return;

      try {
        // Buscar dados do usuário
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user?.email) {
          setUserEmail(user.email);
        }

        // Buscar dados do pedido
        const { data, error } = await supabase
          .from("orders")
          .select(
            `
            *,
            order_items (
              courses (
                title,
                slug,
                duration_hours,
                level
              )
            )
          `
          )
          .eq("id", orderId)
          .single();

        if (!error && data) {
          setOrder(data);
        } else {
          console.error("Erro ao buscar pedido:", error);
          toast.error("Não foi possível carregar os detalhes do pedido");
        }
      } catch (error) {
        console.error("Erro:", error);
        toast.error("Erro ao carregar informações");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderAndUser();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-custom py-20 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-white animate-pulse" />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">
                Preparando sua experiência
              </h2>
              <p className="text-muted-foreground text-lg">
                Estamos organizando tudo para você começar a aprender
              </p>
            </div>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-custom py-20 text-center">
          <div className="max-w-md mx-auto space-y-8">
            <div className="w-32 h-32 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Shield className="h-16 w-16 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-foreground">
                Pedido não encontrado
              </h1>
              <p className="text-xl text-muted-foreground">
                Não foi possível localizar os detalhes do seu pedido. Entre em
                contato conosco se precisar de ajuda.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn btn-primary">
                <Link
                  href="/dashboard/courses"
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-5 w-5" />
                  Meus Cursos
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/courses" className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  Explorar Cursos
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
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section de Sucesso */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-green-900/20 dark:via-gray-800 dark:to-blue-900/20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Ícone e Mensagem Principal */}
            <div className="text-center mb-12">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                  <CheckCircle2 className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                    <Sparkles className="h-4 w-4 text-yellow-900" />
                  </div>
                </div>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Parabéns! Compra Realizada com Sucesso 🎉
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Seu pedido foi processado e agora você tem acesso completo aos
                cursos. Prepare-se para transformar sua carreira!
              </p>
            </div>

            {/* Grid de Informações */}
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {/* Detalhes do Pedido */}
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Detalhes do Pedido
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Número:</span>
                      <span className="font-mono font-medium">
                        {order.id.slice(0, 8)}...
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="font-bold text-primary text-lg">
                        R$ {order.total_amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data:</span>
                      <span className="font-medium">
                        {new Date(order.created_at).toLocaleDateString(
                          "pt-BR",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                        ✅ Concluído
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cursos Adquiridos */}
              <Card className="lg:col-span-2 border-0 shadow-lg">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Gift className="h-5 w-5 text-purple-600" />
                    Seus Novos Cursos ({order.order_items?.length || 0})
                  </h3>
                  <div className="space-y-4">
                    {order.order_items?.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 rounded-lg border bg-white/50 dark:bg-gray-800/50"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {item.courses.title[0]}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground text-sm">
                            {item.courses.title}
                          </h4>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            {item.courses.duration_hours && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{item.courses.duration_hours}h</span>
                              </div>
                            )}
                            {item.courses.level && (
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span className="capitalize">
                                  {item.courses.level}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link
                            href={`/courses/${item.courses.slug}`}
                            className="flex items-center gap-2"
                          >
                            Acessar
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ações Principais */}
            <div className="text-center mb-12">
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Link
                    href="/dashboard/courses"
                    className="flex items-center gap-3"
                  >
                    <BookOpen className="h-5 w-5" />
                    Acessar Meus Cursos
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg">
                  <Link href="/courses" className="flex items-center gap-3">
                    <Rocket className="h-5 w-5" />
                    Continuar Explorando
                  </Link>
                </Button>
              </div>

              {/* Informações de Acesso */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <Mail className="h-6 w-6 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium text-sm">Email enviado</div>
                    <div className="text-xs text-muted-foreground">
                      Confirmação para {userEmail || "seu email"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <Download className="h-6 w-6 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium text-sm">Acesso Imediato</div>
                    <div className="text-xs text-muted-foreground">
                      Comece a aprender agora
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <CheckCircle2 className="h-6 w-6 text-purple-600" />
                  <div className="text-left">
                    <div className="font-medium text-sm">Certificado</div>
                    <div className="text-xs text-muted-foreground">
                      Incluso em todos os cursos
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dica Final */}
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Sparkles className="h-6 w-6 text-blue-600" />
                <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                  Próximos Passos
                </h4>
              </div>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Acesse seu dashboard para acompanhar seu progresso, baixar
                materiais e interagir com a comunidade. Seu sucesso é nossa
                prioridade! 🚀
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
