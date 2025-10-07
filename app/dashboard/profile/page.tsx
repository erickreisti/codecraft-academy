// app/dashboard/profile/page.tsx - VERSÃO SEM MENSAGEM DE SUCESSO EXTRA
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { updateProfile } from "@/app/actions/profile-actions";
import { Session } from "@supabase/supabase-js";

// ✅ INTERFACES DE TIPAGEM
interface UserProfile {
  id: string;
  full_name?: string;
  bio?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // REMOVIDO: const [success, setSuccess] = useState(false); // Não é mais necessário

  // 🔍 BUSCAR SESSÃO E DADOS DO USUÁRIO
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Verificar sessão
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (!currentSession) {
          console.log(
            "❌ Nenhuma sessão encontrada - redirecionando para login"
          );
          router.push("/login");
          return;
        }

        setSession(currentSession);

        // Buscar perfil
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentSession.user.id)
          .single();

        setProfile(profileData);
      } catch (error) {
        console.error("💥 Erro ao buscar dados:", error);
        toast.error("Erro ao carregar perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // REMOVIDO: useEffect para verificar success da URL, pois não é mais usado

  // Calcular tempo como membro
  const memberSince = session ? new Date(session.user.created_at) : new Date();
  const now = new Date();
  const monthsAsMember = Math.floor(
    (now.getTime() - memberSince.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-spin">🔄</div>
          <h2 className="text-xl font-bold">Carregando perfil...</h2>
        </div>
      </div>
    );
  }

  // ✅ NOVA FUNÇÃO PARA SALVAR
  const handleSaveProfile = async (formData: FormData) => {
    if (!session) return;

    setSaving(true);

    try {
      const result = await updateProfile(session.user.id, formData);

      if (result.success) {
        // REMOVIDO: setSuccess(true);
        toast.success("Perfil atualizado!", {
          description: "Suas alterações foram salvas com sucesso.",
        });

        // Atualizar dados locais
        const { data: updatedProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        setProfile(updatedProfile);

        // REMOVIDO: setTimeout para esconder mensagem de sucesso, pois não existe mais
      } else {
        toast.error("Erro ao salvar", {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error("Erro inesperado");
      console.error("Erro ao salvar perfil:", error);
    } finally {
      setSaving(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">🔐</div>
          <h2 className="text-xl font-bold">Não autorizado</h2>
          <p>Redirecionando para login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-30">
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">👤 Meu Perfil</h1>
              <p className="text-muted-foreground">
                Gerencie suas informações pessoais
              </p>
            </div>
            <Button asChild variant="outline" className="group">
              <Link href="/dashboard" className="flex items-center gap-2">
                ← Voltar ao Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* FORMULÁRIO DE PERFIL */}
          <div className="lg:col-span-2">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ✏️ Informações Pessoais
                </CardTitle>
                <CardDescription>
                  Atualize suas informações de perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* FORMULÁRIO */}
                <form action={handleSaveProfile} className="space-y-6">
                  {/* Email (somente leitura) */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      📧 Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={session.user.email || ""}
                      disabled
                      className="bg-muted cursor-not-allowed"
                    />
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      🔒 O email não pode ser alterado
                    </p>
                  </div>

                  {/* Nome Completo */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="full_name"
                      className="flex items-center gap-2"
                    >
                      👋 Nome Completo
                    </Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      type="text"
                      defaultValue={profile?.full_name || ""}
                      placeholder="Como você gostaria de ser chamado?"
                    />
                    <p className="text-sm text-muted-foreground">
                      Este nome aparecerá no seu perfil público
                    </p>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="flex items-center gap-2">
                      📝 Bio
                    </Label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      defaultValue={profile?.bio || ""}
                      placeholder="Conte um pouco sobre você..."
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                    />
                    <p className="text-sm text-muted-foreground">
                      {profile?.bio?.length || 0}/500 caracteres
                    </p>
                  </div>

                  {/* Website */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="website"
                      className="flex items-center gap-2"
                    >
                      🌐 Website
                    </Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      defaultValue={profile?.website || ""}
                      placeholder="https://seusite.com  "
                    />
                  </div>

                  <Button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={saving}
                  >
                    {saving ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Salvando...
                      </div>
                    ) : (
                      "💾 Salvar Alterações"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* INFORMAÇÕES DA CONTA */}
          <div className="space-y-6">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📊 Informações da Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">🆔 ID do Usuário</p>
                  <p className="text-sm text-muted-foreground font-mono bg-muted px-2 py-1 rounded mt-1">
                    {session.user.id.substring(0, 8)}...
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium">📅 Membro desde</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {memberSince.toLocaleDateString("pt-BR")}
                    <span className="block text-xs text-green-600 mt-1">
                      ✅ {monthsAsMember}{" "}
                      {monthsAsMember === 1 ? "mês" : "meses"} na plataforma
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* AÇÕES RÁPIDAS */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ⚡ Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/forgot-password">🔒 Alterar Senha</Link>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/dashboard">📚 Meus Cursos</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
