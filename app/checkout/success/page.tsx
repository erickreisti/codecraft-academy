// app/checkout/success/page.tsx - VERSÃO CORRIGIDA
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { CheckCircle2, Download, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client"; // CORREÇÃO: Usar cliente configurado

interface OrderDetails {
  id: string;
  total_amount: number;
  created_at: string;
  order_items: Array<{
    courses: {
      title: string;
      slug: string;
    };
  }>;
}

export default function CheckoutSuccessPage() {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items (
            courses (
              title,
              slug
            )
          )
        `
        )
        .eq("id", orderId)
        .single();

      if (!error && data) {
        setOrder(data);
      }
      setLoading(false);
    };

    fetchOrder();
  }, [orderId]); // CORREÇÃO: Removido supabase das dependências

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-custom py-16 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <h2 className="text-xl font-semibold">Carregando seu pedido...</h2>
            <p className="text-muted-foreground">
              Preparando os detalhes da sua compra
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Se não encontrou o pedido
  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-custom py-16 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-6xl">❌</div>
            <h1 className="text-2xl font-bold">Pedido não encontrado</h1>
            <p className="text-muted-foreground">
              Não foi possível encontrar os detalhes do seu pedido.
            </p>
            <div className="space-y-3">
              <Button asChild className="btn btn-primary">
                <Link href="/dashboard/courses">Meus Cursos</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/courses">Explorar Cursos</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container-custom py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Ícone de sucesso */}
          <div className="mb-6">
            <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />
          </div>

          {/* Mensagem principal */}
          <h1 className="text-3xl font-bold mb-4">
            Parabéns! Compra Realizada 🎉
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Seu pedido foi processado com sucesso. Agora você tem acesso aos
            cursos.
          </p>

          {/* Detalhes do pedido */}
          <Card className="mb-8 text-left">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Número do Pedido:</span>
                  <span className="font-mono">{order.id.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-primary">
                    R$ {order.total_amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Data:</span>
                  <span>
                    {new Date(order.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                    ✅ Concluído
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cursos comprados */}
          {order?.order_items && order.order_items.length > 0 && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 text-left">
                  🎓 Cursos Adquiridos:
                </h3>
                <div className="space-y-3">
                  {order.order_items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b last:border-b-0"
                    >
                      <div className="flex-1 text-left">
                        <span className="font-medium text-sm">
                          {item.courses.title}
                        </span>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <Link
                          href={`/courses/${item.courses.slug}`}
                          className="flex items-center gap-1"
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
          )}

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild className="btn btn-primary">
              <Link
                href="/dashboard/courses"
                className="flex items-center gap-2"
              >
                📚 Meus Cursos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href="/courses" className="flex items-center gap-2">
                🚀 Continuar Navegando
              </Link>
            </Button>
          </div>

          {/* Informações adicionais */}
          <div className="mt-8 p-6 bg-muted/30 rounded-lg border">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Email de confirmação enviado</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Acesso imediato e vitalício</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Certificado inclusivo</span>
              </div>
            </div>
          </div>

          {/* Dica */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              💡 Acesse &quot;Meus Cursos&quot; no dashboard para começar a
              aprender!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
