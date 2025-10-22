// app/dashboard/profile/page.tsx - VERSÃO PREMIUM COM MELHORIAS
"use client";

export const dynamic = "force-dynamic";

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
  Award,
  Star,
  Settings,
  Rocket,
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

  // ✅ FUNÇÃO PARA SALVAR PERFIL
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
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

  const displayName =
    profile?.full_name || session.user.email?.split("@")[0] || "Usuário";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* HEADER DESTACADO */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white shadow-2xl dark:from-gray-800 dark:via-purple-900 dark:to-gray-800">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between py-8 lg:py-12">
            {/* INFORMAÇÕES DO USUÁRIO */}
            <div className="flex items-start lg:items-center gap-6 mb-6 lg:mb-0">
              {/* AVATAR SIMPLES E ARREDONDADO - SEM BORDA */}
              <div className="relative group">
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 shadow-2xl">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl lg:text-3xl font-bold text-white">
                        {displayName[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* BADGE ONLINE */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 border-4 border-white dark:border-gray-800 rounded-full"></div>

                {/* OVERLAY HOVER */}
                <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>

              {/* INFORMAÇÕES DE TEXTO */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl lg:text-4xl font-bold tracking-tight">
                    Meu Perfil
                  </h1>

                  {/* BADGE DE DESTAQUE */}
                  {profile?.role === "admin" && (
                    <div className="inline-flex items-center gap-1 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                      <Crown className="h-3 w-3" />
                      ADMIN
                    </div>
                  )}
                  {profile?.role === "instructor" && (
                    <div className="inline-flex items-center gap-1 bg-green-400 text-green-900 px-3 py-1 rounded-full text-sm font-bold">
                      <Star className="h-3 w-3" />
                      INSTRUTOR
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-blue-100 dark:text-blue-200">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm lg:text-base">{displayName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm lg:text-base">
                      {session.user.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm lg:text-base">
                      Membro há {monthsAsMember}{" "}
                      {monthsAsMember === 1 ? "mês" : "meses"}
                    </span>
                  </div>
                </div>

                {/* MENSAGEM PERSONALIZADA */}
                <p className="text-blue-100 dark:text-blue-200 text-sm lg:text-base max-w-2xl">
                  {profile?.role === "admin"
                    ? "🎯 Você tem acesso completo à plataforma como administrador."
                    : profile?.role === "instructor"
                    ? "📚 Compartilhe seu conhecimento e inspire outros alunos."
                    : "🌟 Continue sua jornada de aprendizado e alcance seus objetivos!"}
                </p>
              </div>
            </div>

            {/* AÇÕES RÁPIDAS */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Button
                asChild
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white btn-lg transition-all duration-300 hover:scale-105 dark:bg-white/10 dark:border-white/20"
              >
                <Link href="/dashboard" className="flex items-center gap-3">
                  <ArrowLeft className="h-5 w-5" />
                  Voltar ao Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ONDA DECORATIVA */}
        <div className="w-full overflow-hidden">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-12 text-white fill-current dark:text-gray-800"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="shape-fill"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="shape-fill"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="container-custom py-12 -mt-8 relative z-10">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* FORMULÁRIO DE PERFIL - LADO ESQUERDO */}
          <div className="lg:col-span-2">
            <Card className="hover-lift p-1 border-0 shadow-xl bg-white/70 backdrop-blur-sm dark:bg-gray-800/70 dark:border-gray-700">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <Edit3 className="h-6 w-6 text-white" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-2xl dark:text-white">
                      Informações Pessoais
                    </CardTitle>
                    <CardDescription className="text-base dark:text-gray-300">
                      Atualize suas informações de perfil e preferências
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* SEÇÃO DE AVATAR */}
                <div className="space-y-6">
                  <Label className="flex items-center gap-3 text-base font-semibold dark:text-gray-200">
                    <Camera className="h-5 w-5 text-muted-foreground" />
                    Foto do Perfil
                  </Label>

                  <div className="flex items-start gap-6">
                    {/* AVATAR PREVIEW - SIMPLES E ARREDONDADO */}
                    <div className="flex-shrink-0">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                          {profile?.avatar_url ? (
                            <img
                              src={profile.avatar_url}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-2xl font-bold text-white">
                                {displayName[0]?.toUpperCase()}
                              </span>
                            </div>
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
                          className="gap-2 flex-1 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
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
                            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 flex-1"
                            onClick={handleRemoveAvatar}
                            disabled={uploadingAvatar}
                          >
                            <Trash2 className="h-4 w-4" />
                            Remover
                          </Button>
                        )}
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground dark:text-gray-400">
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
                      className="flex items-center gap-3 text-base font-semibold dark:text-gray-200"
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
                      className="h-12 text-base bg-muted/50 cursor-not-allowed border-2 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-200"
                    />
                    <p className="text-sm text-muted-foreground flex items-center gap-2 dark:text-gray-400">
                      <Lock className="h-4 w-4" />O email não pode ser alterado
                    </p>
                  </div>

                  {/* NOME COMPLETO */}
                  <div className="space-y-4">
                    <Label
                      htmlFor="full_name"
                      className="flex items-center gap-3 text-base font-semibold dark:text-gray-200"
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
                      className="h-12 text-base border-2 focus:border-primary transition-colors dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:border-blue-400"
                    />
                  </div>

                  {/* BIO */}
                  <div className="space-y-4">
                    <Label
                      htmlFor="bio"
                      className="flex items-center gap-3 text-base font-semibold dark:text-gray-200"
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
                      className="w-full min-h-[120px] rounded-lg border-2 border-input bg-background px-4 py-3 text-base resize-none focus:border-primary transition-colors leading-relaxed dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:border-blue-400"
                    />
                    <div className="flex justify-between items-center text-sm text-muted-foreground dark:text-gray-400">
                      <span>Máximo 500 caracteres</span>
                      <span>{profile?.bio?.length || 0}/500</span>
                    </div>
                  </div>

                  {/* WEBSITE */}
                  <div className="space-y-4">
                    <Label
                      htmlFor="website"
                      className="flex items-center gap-3 text-base font-semibold dark:text-gray-200"
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
                      className="h-12 text-base border-2 focus:border-primary transition-colors dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:border-blue-400"
                    />
                  </div>

                  {/* BOTÃO SALVAR */}
                  <Button
                    type="submit"
                    className="w-full h-14 text-base font-semibold btn btn-primary group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-700 dark:to-purple-700 dark:hover:from-blue-800 dark:hover:to-purple-800"
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
            <Card className="hover-lift border-0 shadow-xl bg-white/70 backdrop-blur-sm dark:bg-gray-800/70 dark:border-gray-700">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl dark:text-white">
                    Informações da Conta
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* ID DO USUÁRIO */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-foreground flex items-center gap-2 dark:text-gray-200">
                    🆔 ID do Usuário
                  </p>
                  <div className="bg-muted/50 rounded-lg p-3 border dark:bg-gray-700/50 dark:border-gray-600">
                    <p className="text-sm font-mono text-muted-foreground truncate dark:text-gray-400">
                      {session.user.id}
                    </p>
                  </div>
                </div>

                {/* TIPO DE CONTA */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-foreground dark:text-gray-200">
                    👤 Tipo de Conta
                  </p>
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                      profile?.role === "admin"
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 border border-yellow-300"
                        : profile?.role === "instructor"
                        ? "bg-gradient-to-r from-green-400 to-green-500 text-green-900 border border-green-300"
                        : "bg-gradient-to-r from-blue-400 to-blue-500 text-blue-900 border border-blue-300"
                    }`}
                  >
                    {profile?.role === "admin" ? (
                      <>
                        <Crown className="h-4 w-4" />
                        <span>Administrador</span>
                      </>
                    ) : profile?.role === "instructor" ? (
                      <>
                        <Award className="h-4 w-4" />
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
                  <p className="text-sm font-semibold text-foreground flex items-center gap-2 dark:text-gray-200">
                    <Calendar className="h-4 w-4" />
                    Membro desde
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      {memberSince.toLocaleDateString("pt-BR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-400 to-green-500 text-green-900 rounded-full text-xs font-medium">
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
            <Card className="hover-lift border-0 shadow-xl bg-white/70 backdrop-blur-sm dark:bg-gray-800/70 dark:border-gray-700">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl dark:text-white">
                    Ações Rápidas
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full h-12 justify-start gap-3 text-base hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all duration-300 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-blue-900/20 dark:hover:text-blue-300 dark:hover:border-blue-700"
                  asChild
                >
                  <Link href="/forgot-password">
                    <Lock className="h-5 w-5" />
                    Alterar Senha
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-12 justify-start gap-3 text-base hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all duration-300 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-green-900/20 dark:hover:text-green-300 dark:hover:border-green-700"
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
                    className="w-full h-12 justify-start gap-3 text-base hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-all duration-300 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-purple-900/20 dark:hover:text-purple-300 dark:hover:border-purple-700"
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
                    className="w-full h-12 justify-start gap-3 text-base hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 transition-all duration-300 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-orange-900/20 dark:hover:text-orange-300 dark:hover:border-orange-700"
                    asChild
                  >
                    <Link href="/instructor">
                      <Award className="h-5 w-5" />
                      Painel do Instrutor
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* CARD DE MOTIVAÇÃO */}
            <Card className="hover-lift border-0 shadow-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white dark:from-blue-600 dark:to-purple-700">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="text-4xl">🌟</div>
                  <h3 className="font-bold text-lg">Continue Evoluindo!</h3>
                  <p className="text-blue-100 dark:text-blue-200 text-sm">
                    Cada passo na sua jornada de aprendizado te aproxima dos
                    seus objetivos.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 dark:bg-white/10 dark:border-white/20 dark:hover:bg-white/20 mt-4"
                    asChild
                  >
                    <Link href="/courses">
                      <Rocket className="h-4 w-4 mr-2" />
                      Explorar Novos Cursos
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
