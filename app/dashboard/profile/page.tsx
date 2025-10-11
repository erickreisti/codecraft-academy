// app/dashboard/profile/page.tsx - VERSÃO FINAL COM AVATAR FUNCIONAL
"use client";

import { useState, useEffect, useRef } from "react";
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
import { updateProfile, getProfile } from "@/app/actions/admin-actions";
import { Session } from "@supabase/supabase-js";
import { Spinner } from "@/components/ui/spinner";
import {
  User,
  Mail,
  Lock,
  BookOpen,
  Crown,
  Calendar,
  Globe,
  Edit3,
  ArrowLeft,
  Save,
  Camera,
  Upload,
  Trash2,
} from "lucide-react";
import { uploadAvatar, deleteImage } from "@/lib/utils/upload";

// ✅ INTERFACES DE TIPAGEM
interface UserProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  role?: string;
  created_at: string;
  updated_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

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

        // ✅ USAR SERVER ACTION PARA BUSCAR PERFIL
        const result = await getProfile(currentSession.user.id);

        if (result.success) {
          setProfile(result.profile);
          console.log("✅ Perfil carregado via Server Action:", result.profile);
        } else {
          // Fallback: tentar com cliente normal
          console.log("🔄 Tentando fallback com cliente normal...");
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", currentSession.user.id)
            .single();

          setProfile(profileData);
        }
      } catch (error) {
        console.error("💥 Erro ao buscar dados:", error);
        toast.error("Erro ao carregar perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // Calcular tempo como membro
  const memberSince = session ? new Date(session.user.created_at) : new Date();
  const now = new Date();
  const monthsAsMember = Math.floor(
    (now.getTime() - memberSince.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  // ✅ UPLOAD DE AVATAR
  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !session) return;

    setUploadingAvatar(true);

    try {
      // Se já existe um avatar, remove o antigo
      if (profile?.avatar_url) {
        await deleteImage(profile.avatar_url);
      }

      // Faz upload do novo avatar usando a função existente
      const { url, error } = await uploadAvatar(file, session.user.id);

      if (error) {
        throw new Error(error);
      }

      // Atualiza o perfil com a nova URL do avatar
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id);

      if (updateError) throw updateError;

      // Atualiza o estado local
      setProfile((prev) => (prev ? { ...prev, avatar_url: url } : null));

      toast.success("Avatar atualizado com sucesso!", {
        description: "Sua foto de perfil foi atualizada",
      });
    } catch (error: any) {
      console.error("❌ Erro ao fazer upload do avatar:", error);
      toast.error("Erro ao atualizar avatar", {
        description: error.message || "Tente novamente com uma imagem menor",
      });
    } finally {
      setUploadingAvatar(false);
      // Limpa o input file
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // ✅ REMOVER AVATAR
  const handleRemoveAvatar = async () => {
    if (!session || !profile?.avatar_url) return;

    setUploadingAvatar(true);

    try {
      // Remove a imagem do storage usando a função existente
      const { error: deleteError } = await deleteImage(profile.avatar_url);

      if (deleteError) {
        console.warn("⚠️ Não foi possível deletar do storage:", deleteError);
        // Continua mesmo se não conseguir deletar do storage
      }

      // Remove a URL do avatar no perfil
      const { error } = await supabase
        .from("profiles")
        .update({
          avatar_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id);

      if (error) throw error;

      // Atualiza o estado local
      setProfile((prev) => (prev ? { ...prev, avatar_url: undefined } : null));

      toast.success("Avatar removido com sucesso!");
    } catch (error: any) {
      console.error("❌ Erro ao remover avatar:", error);
      toast.error("Erro ao remover avatar", {
        description: error.message,
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // ✅ FUNÇÃO PARA SALVAR PERFIL (UNIVERSAL)
  const handleSaveProfile = async (formData: FormData) => {
    if (!session) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }

    setSaving(true);

    try {
      // ✅ USAR SERVER ACTION UNIVERSAL
      const result = await updateProfile(session.user.id, formData);

      if (result.success) {
        toast.success("Perfil atualizado com sucesso!", {
          description: "Suas informações foram salvas.",
        });

        // Atualizar estado local com os dados retornados
        if (result.profile) {
          setProfile(result.profile);
        }

        // Atualizar user_metadata no Supabase Auth
        if (formData.get("full_name")) {
          const { error } = await supabase.auth.updateUser({
            data: { full_name: formData.get("full_name") as string },
          });
          if (error) {
            console.warn("⚠️ Não foi possível atualizar user_metadata:", error);
          }
        }
      } else {
        toast.error("Erro ao salvar perfil", {
          description: result.error,
        });
      }
    } catch (error) {
      console.error("💥 Erro inesperado:", error);
      toast.error("Erro inesperado ao salvar perfil");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <Spinner size="lg" className="mx-auto" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Carregando perfil...
            </h2>
            <p className="text-muted-foreground">Preparando suas informações</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🔐</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Não autorizado
            </h2>
            <p className="text-muted-foreground">
              Redirecionando para login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER MELHORADO */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
        <div className="container-custom">
          <div className="flex h-20 items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <User className="h-8 w-8 text-primary" />
                Meu Perfil
              </h1>
              <p className="text-muted-foreground text-lg">
                Gerencie suas informações pessoais e preferências
              </p>
            </div>
            <Button asChild variant="outline" className="group btn-lg">
              <Link href="/dashboard" className="flex items-center gap-3">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Voltar ao Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT COM ESPAÇAMENTOS PROFISSIONAIS */}
      <main className="container-custom py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* FORMULÁRIO DE PERFIL - LADO ESQUERDO */}
          <div className="lg:col-span-2">
            <Card className="hover-lift p-1">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Edit3 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-2xl">
                      Informações Pessoais
                    </CardTitle>
                    <CardDescription className="text-base">
                      Atualize suas informações de perfil e preferências
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* SEÇÃO DE AVATAR */}
                <div className="space-y-6">
                  <Label className="flex items-center gap-3 text-base font-semibold">
                    <Camera className="h-5 w-5 text-muted-foreground" />
                    Foto do Perfil
                  </Label>

                  <div className="flex items-start gap-6">
                    {/* AVATAR PREVIEW */}
                    <div className="flex-shrink-0">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-full border-4 border-background shadow-lg overflow-hidden bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
                          {profile?.avatar_url ? (
                            <img
                              src={profile.avatar_url}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback se a imagem não carregar
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <User className="h-10 w-10 text-muted-foreground" />
                          )}
                        </div>

                        {/* OVERLAY COM AÇÕES NO HOVER */}
                        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Camera className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* CONTROLES DO AVATAR */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleAvatarUpload}
                          className="hidden"
                          disabled={uploadingAvatar}
                        />

                        <Button
                          type="button"
                          variant="outline"
                          className="gap-2 flex-1"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingAvatar}
                        >
                          {uploadingAvatar ? (
                            <Spinner size="sm" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                          {uploadingAvatar ? "Enviando..." : "Alterar Foto"}
                        </Button>

                        {profile?.avatar_url && (
                          <Button
                            type="button"
                            variant="outline"
                            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 dark:border-red-800 flex-1"
                            onClick={handleRemoveAvatar}
                            disabled={uploadingAvatar}
                          >
                            <Trash2 className="h-4 w-4" />
                            Remover
                          </Button>
                        )}
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Formatos suportados: JPEG, PNG, WebP</p>
                        <p>Tamanho máximo: 5MB</p>
                        <p className="text-xs">Recomendado: 400x400 pixels</p>
                      </div>
                    </div>
                  </div>
                </div>

                <form action={handleSaveProfile} className="space-y-8">
                  {/* EMAIL - SOMENTE LEITURA */}
                  <div className="space-y-4">
                    <Label
                      htmlFor="email"
                      className="flex items-center gap-3 text-base font-semibold"
                    >
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={session.user.email || ""}
                      disabled
                      className="h-12 text-base bg-muted/50 cursor-not-allowed border-2"
                    />
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Lock className="h-4 w-4" />O email não pode ser alterado
                    </p>
                  </div>

                  {/* NOME COMPLETO */}
                  <div className="space-y-4">
                    <Label
                      htmlFor="full_name"
                      className="flex items-center gap-3 text-base font-semibold"
                    >
                      <User className="h-5 w-5 text-muted-foreground" />
                      Nome Completo
                    </Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      type="text"
                      defaultValue={profile?.full_name || ""}
                      placeholder="Como você gostaria de ser chamado?"
                      className="h-12 text-base border-2 focus:border-primary transition-colors"
                    />
                  </div>

                  {/* BIO */}
                  <div className="space-y-4">
                    <Label
                      htmlFor="bio"
                      className="flex items-center gap-3 text-base font-semibold"
                    >
                      <Edit3 className="h-5 w-5 text-muted-foreground" />
                      Bio
                    </Label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={5}
                      defaultValue={profile?.bio || ""}
                      placeholder="Conte um pouco sobre você, suas experiências e interesses..."
                      className="w-full min-h-[120px] rounded-lg border-2 border-input bg-background px-4 py-3 text-base resize-none focus:border-primary transition-colors leading-relaxed"
                    />
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Máximo 500 caracteres</span>
                      <span>{profile?.bio?.length || 0}/500</span>
                    </div>
                  </div>

                  {/* WEBSITE */}
                  <div className="space-y-4">
                    <Label
                      htmlFor="website"
                      className="flex items-center gap-3 text-base font-semibold"
                    >
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      Website
                    </Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      defaultValue={profile?.website || ""}
                      placeholder="https://seusite.com"
                      className="h-12 text-base border-2 focus:border-primary transition-colors"
                    />
                  </div>

                  {/* BOTÃO SALVAR */}
                  <Button
                    type="submit"
                    className="w-full h-14 text-base font-semibold btn btn-primary group"
                    disabled={saving || uploadingAvatar}
                  >
                    {saving ? (
                      <div className="flex items-center gap-3 justify-center">
                        <Spinner size="sm" />
                        <span>Salvando alterações...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 justify-center">
                        <Save className="h-5 w-5" />
                        <span>Salvar Alterações</span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* INFORMACOES DA CONTA - LADO DIREITO */}
          <div className="space-y-8">
            {/* CARD DE INFORMAÇÕES DA CONTA */}
            <Card className="hover-lift">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">
                    Informações da Conta
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* ID DO USUÁRIO */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                    🆔 ID do Usuário
                  </p>
                  <div className="bg-muted/50 rounded-lg p-3 border">
                    <p className="text-sm font-mono text-muted-foreground truncate">
                      {session.user.id}
                    </p>
                  </div>
                </div>

                {/* TIPO DE CONTA */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-foreground">
                    👤 Tipo de Conta
                  </p>
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                      profile?.role === "admin"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                        : profile?.role === "instructor"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border border-orange-200 dark:border-orange-800"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                    }`}
                  >
                    {profile?.role === "admin" ? (
                      <>
                        <Crown className="h-4 w-4" />
                        <span>Administrador</span>
                      </>
                    ) : profile?.role === "instructor" ? (
                      <>
                        <BookOpen className="h-4 w-4" />
                        <span>Instrutor</span>
                      </>
                    ) : (
                      <>
                        <User className="h-4 w-4" />
                        <span>Aluno</span>
                      </>
                    )}
                  </div>
                </div>

                {/* MEMBRO DESDE */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Membro desde
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {memberSince.toLocaleDateString("pt-BR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs font-medium">
                      <span>✅</span>
                      <span>
                        {monthsAsMember}{" "}
                        {monthsAsMember === 1 ? "mês" : "meses"} na plataforma
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AÇÕES RÁPIDAS */}
            <Card className="hover-lift">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Lock className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl">Ações Rápidas</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full h-12 justify-start gap-3 text-base hover:bg-muted/50 transition-colors"
                  asChild
                >
                  <Link href="/forgot-password">
                    <Lock className="h-5 w-5" />
                    Alterar Senha
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-12 justify-start gap-3 text-base hover:bg-muted/50 transition-colors"
                  asChild
                >
                  <Link href="/dashboard">
                    <BookOpen className="h-5 w-5" />
                    Meus Cursos
                  </Link>
                </Button>

                {/* LINK PARA ADMIN SE FOR ADMIN */}
                {profile?.role === "admin" && (
                  <Button
                    variant="outline"
                    className="w-full h-12 justify-start gap-3 text-base hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 dark:hover:bg-purple-900/20 dark:hover:text-purple-300 transition-colors"
                    asChild
                  >
                    <Link href="/admin">
                      <Crown className="h-5 w-5" />
                      Painel Administrativo
                    </Link>
                  </Button>
                )}

                {/* LINK PARA INSTRUTOR SE FOR INSTRUTOR */}
                {profile?.role === "instructor" && (
                  <Button
                    variant="outline"
                    className="w-full h-12 justify-start gap-3 text-base hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 dark:hover:bg-orange-900/20 dark:hover:text-orange-300 transition-colors"
                    asChild
                  >
                    <Link href="/instructor">
                      <BookOpen className="h-5 w-5" />
                      Painel do Instrutor
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
