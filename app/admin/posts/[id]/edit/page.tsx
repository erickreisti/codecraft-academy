"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { ImageUpload } from "@/components/ui/image-upload";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { getAdminPost, updatePost } from "@/app/actions/admin-actions";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [post, setPost] = useState<any>(null);
  const [loadingPost, setLoadingPost] = useState(true);

  // Estado do formulário
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    image_url: "",
    published: false,
  });

  // Carregar post e verificar auth
  useEffect(() => {
    const loadData = async () => {
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

      // ✅ USAR SERVER ACTION PARA CARREGAR POST
      const result = await getAdminPost(postId);

      if (result.success && result.data) {
        setPost(result.data);
        setFormData(result.data);
      } else {
        toast.error("Erro ao carregar post", {
          description: result.error,
        });
        router.push("/admin/posts");
      }

      setLoadingPost(false);
    };

    loadData();
  }, [postId, router]);

  // Gerar slug automaticamente do título
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
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

      // Preparar dados para atualização
      const updateData = {
        ...formData,
        published_at:
          formData.published && !post.published
            ? new Date().toISOString()
            : post.published_at,
      };

      console.log("📤 Atualizando post:", postId, updateData);

      // ✅ USAR SERVER ACTION PARA ATUALIZAR
      const result = await updatePost(postId, updateData);

      if (!result.success) {
        toast.error("Erro ao atualizar post", {
          description: result.error,
        });
        return;
      }

      toast.success("Post atualizado com sucesso!");
      router.push("/admin/posts");
    } catch (error) {
      console.error("💥 Erro inesperado:", error);
      toast.error("Erro inesperado ao atualizar post");
    } finally {
      setLoading(false);
    }
  };

  if (loadingPost || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">Post não encontrado</h2>
          <p className="text-muted-foreground mb-4">
            O post que você está tentando editar não existe.
          </p>
          <Button asChild>
            <Link href="/admin/posts">Voltar para Posts</Link>
          </Button>
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
              <h1 className="text-3xl font-bold">Editar Post</h1>
              <p className="text-muted-foreground mt-2">{post.title}</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/admin/posts">← Voltar</Link>
            </Button>
          </div>

          {/* Formulário */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Post</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Upload de Imagem */}
                <ImageUpload
                  onImageUpload={handleImageUpload}
                  onImageRemove={handleImageRemove}
                  currentImage={formData.image_url}
                  folder="posts"
                  userId={user?.id || ""}
                  aspectRatio="banner"
                  maxSize={5}
                />

                {/* Título e Slug */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título do Post *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
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
                      required
                    />
                  </div>
                </div>

                {/* Descrição Curta */}
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Descrição Curta</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        excerpt: e.target.value,
                      }))
                    }
                    rows={3}
                    maxLength={300}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.excerpt.length}/300 caracteres
                  </p>
                </div>

                {/* Conteúdo Completo */}
                <div className="space-y-2">
                  <Label htmlFor="content">Conteúdo Completo</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    rows={12}
                  />
                </div>

                {/* Status */}
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
                        Atualizando...
                      </div>
                    ) : (
                      "💾 Atualizar Post"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/posts")}
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
