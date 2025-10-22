"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { createCourse } from "@/app/actions/admin-actions";
import { ImageUpload } from "@/components/ui/image-upload";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Estado do formulário
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    short_description: "",
    price: 0,
    duration_hours: 0,
    level: "iniciante" as "iniciante" | "intermediario" | "avancado",
    category: "",
    image_url: "",
    featured: false,
    published: false,
  });

  // Verificar autenticação e admin
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);

      // Verificar se é admin
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        router.push("/");
        return;
      }

      setIsAdmin(true);
    };

    checkAuth();
  }, [router]);

  // Gerar slug automaticamente do título
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Atualizar slug quando título mudar
  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  // Manipular upload de imagem
  const handleImageUpload = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, image_url: imageUrl }));
  };

  const handleImageRemove = () => {
    setFormData((prev) => ({ ...prev, image_url: "" }));
  };

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validações básicas
      if (!formData.title.trim()) {
        toast.error("Título é obrigatório");
        return;
      }

      if (!formData.slug.trim()) {
        toast.error("Slug é obrigatório");
        return;
      }

      console.log("📤 Enviando para Server Action:", formData);

      // Usar Server Action com SERVICE_ROLE_KEY (ignora RLS)
      const result = await createCourse(formData);

      if (!result.success) {
        toast.error("Erro ao criar curso", {
          description: result.error,
        });
        return;
      }

      toast.success("Curso criado com sucesso!", {
        description: "O curso foi salvo no banco de dados.",
      });

      // Redirecionar para lista de cursos
      router.push("/admin/courses");
    } catch (error) {
      console.error("💥 Erro inesperado:", error);
      toast.error("Erro inesperado ao criar curso");
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p>Verificando acesso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Criar Novo Curso</h1>
              <p className="text-muted-foreground mt-2">
                Adicione um novo curso à plataforma
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/admin/courses">← Voltar</Link>
            </Button>
          </div>

          {/* Formulário */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Curso</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Upload de Imagem */}
                <ImageUpload
                  onImageUpload={handleImageUpload}
                  onImageRemove={handleImageRemove}
                  currentImage={formData.image_url}
                  folder="courses"
                  userId={user?.id || ""}
                  aspectRatio="video"
                  maxSize={5}
                />

                {/* Título e Slug */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título do Curso *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Ex: React do Zero ao Avançado"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          slug: e.target.value,
                        }))
                      }
                      placeholder="react-do-zero-ao-avancado"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      URL amigável (gerado automaticamente)
                    </p>
                  </div>
                </div>

                {/* Descrições */}
                <div className="space-y-2">
                  <Label htmlFor="short_description">Descrição Curta</Label>
                  <Input
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        short_description: e.target.value,
                      }))
                    }
                    placeholder="Breve descrição para cards e listagens"
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.short_description.length}/160 caracteres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição Completa</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Descrição detalhada do curso..."
                    rows={6}
                  />
                </div>

                {/* Preço e Duração */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price: parseFloat(e.target.value) || 0,
                        }))
                      }
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration_hours">Duração (horas)</Label>
                    <Input
                      id="duration_hours"
                      type="number"
                      min="0"
                      value={formData.duration_hours}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          duration_hours: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      placeholder="Ex: Frontend, Backend"
                    />
                  </div>
                </div>

                {/* Nível e Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="level">Nível</Label>
                    <Select
                      value={formData.level}
                      onValueChange={(
                        value: "iniciante" | "intermediario" | "avancado"
                      ) => setFormData((prev) => ({ ...prev, level: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iniciante">Iniciante</SelectItem>
                        <SelectItem value="intermediario">
                          Intermediário
                        </SelectItem>
                        <SelectItem value="avancado">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="featured">Destaque</Label>
                    <Select
                      value={formData.featured.toString()}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          featured: value === "true",
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">Normal</SelectItem>
                        <SelectItem value="true">Em Destaque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="published">Status</Label>
                    <Select
                      value={formData.published.toString()}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          published: value === "true",
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">Rascunho</SelectItem>
                        <SelectItem value="true">Publicado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-4 pt-6 border-t">
                  <Button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Spinner size="sm" />
                        Criando...
                      </div>
                    ) : (
                      "🎓 Criar Curso"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/courses")}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
