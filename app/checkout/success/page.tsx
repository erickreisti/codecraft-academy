// app/checkout/success/page.tsx - VERSÃO COMPLETA CORRIGIDA

"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Star,
  Award,
  PlayCircle,
  BarChart3,
  Calendar,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import Image from "next/image";

interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string;
  short_description?: string;
  duration_hours?: number;
  level?: string;
  image_url?: string;
  category?: string;
  featured?: boolean;
  published?: boolean;
}

interface OrderItem {
  id: string;
  course_id: string;
  price: number;
  quantity: number;
  course?: Course;
}

interface OrderDetails {
  id: string;
  total_amount: number;
  created_at: string;
  coupon_code?: string;
  discount_amount?: number;
  order_items?: OrderItem[];
}

// Função para obter cor do nível - MOVIDA PARA FORA DO COMPONENTE
const getLevelColor = (level: string) => {
  switch (level?.toLowerCase()) {
    case "iniciante":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "intermediario":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "avancado":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

export default function CheckoutSuccessPage() {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order");

  useEffect(() => {
    const fetchOrderAndUser = async () => {
      if (!orderId) {
        console.error("Nenhum ID de pedido fornecido");
        toast.error("Pedido não encontrado");
        setLoading(false);
        return;
      }

      try {
        // Buscar dados do usuário
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) {
          console.error("Erro ao buscar usuário:", userError);
        }
        if (user?.email) {
          setUserEmail(user.email);
        }

        // Buscar perfil do usuário para o nome
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .single();

          if (profile?.full_name) {
            setUserName(profile.full_name);
          }
        }

        console.log("🔄 Buscando pedido:", orderId);

        // 1. Primeiro buscar o pedido básico
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (orderError) {
          console.error("❌ Erro ao buscar pedido:", orderError);
          toast.error("Não foi possível carregar os detalhes do pedido");
          setLoading(false);
          return;
        }

        if (!orderData) {
          console.error("Pedido não encontrado");
          toast.error("Pedido não encontrado");
          setLoading(false);
          return;
        }

        console.log("✅ Pedido encontrado:", orderData);

        // 2. Buscar os itens do pedido
        const { data: orderItems, error: itemsError } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", orderId);

        if (itemsError) {
          console.error("❌ Erro ao buscar itens do pedido:", itemsError);
          toast.error("Erro ao carregar itens do pedido");
          setLoading(false);
          return;
        }

        console.log("✅ Itens do pedido:", orderItems);

        // 3. Buscar detalhes COMPLETOS dos cursos
        if (orderItems && orderItems.length > 0) {
          const courseIds = orderItems.map((item) => item.course_id);

          console.log("📚 IDs dos cursos:", courseIds);

          const { data: coursesData, error: coursesError } = await supabase
            .from("courses")
            .select("*")
            .in("id", courseIds);

          if (coursesError) {
            console.error("❌ Erro ao buscar cursos:", coursesError);
            toast.error("Erro ao carregar detalhes dos cursos");
          }

          console.log("✅ Cursos encontrados:", coursesData);

          // Combinar os dados
          const orderWithItems: OrderDetails = {
            ...orderData,
            order_items: orderItems.map((item) => {
              const course = coursesData?.find((c) => c.id === item.course_id);
              console.log(`🔗 Vinculando curso ${item.course_id}:`, course);

              return {
                ...item,
                course: course || undefined,
              };
            }),
          };

          setOrder(orderWithItems);
        } else {
          setOrder({ ...orderData, order_items: [] });
        }
      } catch (error) {
        console.error("💥 Erro completo:", error);
        toast.error("Erro ao carregar informações do pedido");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderAndUser();
  }, [orderId]);

  // Função para debug - mostrar dados no console
  useEffect(() => {
    if (order) {
      console.log("🎯 Dados finais do pedido:", order);
      console.log("📦 Itens do pedido:", order.order_items);
      order.order_items?.forEach((item, index) => {
        console.log(`📖 Item ${index + 1}:`, item);
        console.log(`📚 Curso do item ${index + 1}:`, item.course);
      });
    }
  }, [order]);

  // Função para redirecionar se não tiver orderId
  useEffect(() => {
    if (!orderId && !loading) {
      toast.error("Pedido não encontrado");
      router.push("/dashboard/courses");
    }
  }, [orderId, loading, router]);

  // Calcular totais - COM VERIFICAÇÃO DE NULL
  const subtotal =
    order?.order_items?.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ) || 0;
  const discount = order?.discount_amount || 0;
  const total = order?.total_amount || 0;

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
          <div className="max-w-6xl mx-auto">
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

              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Parabéns{userName ? `, ${userName.split(" ")[0]}` : ""}! 🎉
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-6">
                Sua compra foi processada com sucesso! Agora você tem acesso
                vitalício aos cursos selecionados.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Badge variant="secondary" className="text-sm py-2 px-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(order.created_at).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Badge>
                <Badge variant="outline" className="text-sm py-2 px-4">
                  <FileText className="h-4 w-4 mr-2" />
                  Pedido: {order.id.slice(0, 8).toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Grid Principal */}
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {/* Detalhes do Pedido */}
              <div className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      Resumo do Pedido
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span>R$ {subtotal.toFixed(2)}</span>
                      </div>

                      {order.coupon_code && (
                        <div className="flex justify-between text-green-600">
                          <span>Cupom ({order.coupon_code}):</span>
                          <span>- R$ {discount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="border-t pt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span className="text-primary">
                            R$ {total.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Itens:</span>
                          <span>{order.order_items?.length || 0} curso(s)</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Status:</span>
                          <span className="text-green-600 font-medium">
                            ✅ Concluído
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Acesso Rápido */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Rocket className="h-5 w-5 text-purple-600" />
                      Acesso Rápido
                    </h3>
                    <div className="space-y-3">
                      <Button
                        asChild
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Link
                          href="/dashboard/courses"
                          className="flex items-center gap-3"
                        >
                          <BookOpen className="h-4 w-4" />
                          Meus Cursos
                        </Link>
                      </Button>
                      <Button
                        asChild
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3"
                        >
                          <BarChart3 className="h-4 w-4" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button
                        asChild
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Link
                          href="/profile"
                          className="flex items-center gap-3"
                        >
                          <Award className="h-4 w-4" />
                          Meu Perfil
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Cursos Adquiridos */}
              <Card className="lg:col-span-2 border-0 shadow-lg">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-6 flex items-center gap-2">
                    <Gift className="h-5 w-5 text-purple-600" />
                    Seus Novos Cursos ({order.order_items?.length || 0})
                  </h3>
                  <div className="space-y-6">
                    {order.order_items?.map((item, index) => {
                      const course = item.course;
                      console.log(`🎨 Renderizando curso ${index}:`, course);

                      return (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row gap-4 p-6 rounded-xl border-2 border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-white dark:from-green-900/10 dark:to-gray-800/50"
                        >
                          {/* Imagem do Curso */}
                          <div className="flex-shrink-0">
                            <div className="w-24 h-24 rounded-lg overflow-hidden border bg-white dark:bg-gray-700">
                              {course?.image_url ? (
                                <Image
                                  src={course.image_url}
                                  alt={course.title || "Curso"}
                                  width={96}
                                  height={96}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                  {course?.title?.[0] || "C"}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Informações do Curso */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                              <div>
                                <h4 className="font-bold text-lg text-foreground mb-1">
                                  {course?.title || "Título não disponível"}
                                </h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {course?.short_description ||
                                    course?.description ||
                                    "Descrição não disponível"}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-primary text-lg mb-1">
                                  R$ {(item.price * item.quantity).toFixed(2)}
                                </div>
                                {item.quantity > 1 && (
                                  <div className="text-xs text-muted-foreground">
                                    {item.quantity}x R$ {item.price.toFixed(2)}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Metadados do Curso */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                              {course?.duration_hours && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>
                                    {course.duration_hours}h de conteúdo
                                  </span>
                                </div>
                              )}
                              {course?.level && (
                                <Badge
                                  variant="outline"
                                  className={getLevelColor(course.level)}
                                >
                                  {course.level}
                                </Badge>
                              )}
                              {course?.category && (
                                <Badge variant="secondary" className="text-xs">
                                  {course.category}
                                </Badge>
                              )}
                            </div>

                            {/* Ações do Curso */}
                            <div className="flex flex-wrap gap-3">
                              <Button
                                asChild
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Link
                                  href={`/courses/${course?.slug || "#"}`}
                                  className="flex items-center gap-2"
                                >
                                  <PlayCircle className="h-4 w-4" />
                                  Começar a Estudar
                                </Link>
                              </Button>
                              <Button asChild variant="outline" size="sm">
                                <Link
                                  href={`/courses/${
                                    course?.slug || "#"
                                  }/content`}
                                  className="flex items-center gap-2"
                                >
                                  <BookOpen className="h-4 w-4" />
                                  Ver Conteúdo
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Benefícios e Próximos Passos */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Benefícios Inclusos */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    Benefícios Inclusos
                  </h3>
                  <div className="space-y-3 text-sm">
                    {[
                      { icon: Award, text: "Certificado de conclusão" },
                      { icon: Download, text: "Acesso vitalício" },
                      { icon: Clock, text: "Atualizações gratuitas" },
                      { icon: Users, text: "Comunidade exclusiva" },
                      { icon: Mail, text: "Suporte dos instrutores" },
                      { icon: Shield, text: "Garantia de 7 dias" },
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <benefit.icon className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-foreground">{benefit.text}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Próximos Passos */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    Próximos Passos
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5 flex-shrink-0">
                        1
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          Acesse seus cursos
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Vá para "Meus Cursos" no dashboard
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5 flex-shrink-0">
                        2
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          Configure seu perfil
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Complete seu perfil para melhor experiência
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5 flex-shrink-0">
                        3
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          Participe da comunidade
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Interaja com outros alunos e instrutores
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ação Principal */}
            <div className="text-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-6 px-8 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Link
                  href="/dashboard/courses"
                  className="flex items-center gap-3"
                >
                  <BookOpen className="h-6 w-6" />
                  Acessar Área de Membros
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <p className="text-muted-foreground mt-4 text-sm">
                Seu acesso está liberado! Comece sua jornada de aprendizado
                agora mesmo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
