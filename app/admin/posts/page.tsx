// app/admin/posts/page.tsx - VERSÃO COMPLETA CORRIGIDA
"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  User,
  ArrowLeft,
  Filter,
  Search,
  Clock,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  published_at: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
  image_url?: string;
  author?: {
    profiles?: {
      full_name: string;
    };
  };
}

export default function AdminPostsPage() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.log("❌ Não logado:", error);
        router.push("/login");
        return;
      }

      setUser(user);
      console.log("👤 Usuário logado:", user.email);

      // Verificar se é admin
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("❌ Erro ao buscar perfil:", profileError);
        router.push("/");
        return;
      }

      const userIsAdmin = profile?.role === "admin";
      setIsAdmin(userIsAdmin);

      if (!userIsAdmin) {
        console.log("❌ Usuário não é admin");
        router.push("/");
        return;
      }

      console.log("✅ Acesso admin concedido para posts");
      // Se é admin, carregar posts
      loadPosts();
    } catch (error) {
      console.error("💥 Erro na verificação:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      setPostsLoading(true);
      console.log("🔄 Buscando posts do Supabase...");

      const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("📊 Resultado da query posts:", { posts, error });

      if (error) {
        console.error("❌ Erro ao buscar posts:", error);
        toast.error("Erro ao carregar posts");
        return;
      }

      // Buscar informações dos autores separadamente
      if (posts && posts.length > 0) {
        const authorIds = posts.map((post) => post.author_id).filter(Boolean);

        if (authorIds.length > 0) {
          const { data: authors, error: authorsError } = await supabase
            .from("profiles")
            .select("id, full_name")
            .in("id", authorIds);

          console.log("👥 Autores encontrados:", authors);

          if (authorsError) {
            console.error("❌ Erro ao buscar autores:", authorsError);
          }

          // Combinar posts com informações dos autores
          const postsWithAuthors = posts.map((post) => {
            const authorProfile = authors?.find(
              (author) => author.id === post.author_id
            );
            return {
              ...post,
              author: authorProfile
                ? {
                    profiles: {
                      full_name: authorProfile.full_name,
                    },
                  }
                : null,
            };
          });

          setPosts(postsWithAuthors);
          console.log(
            `✅ ${postsWithAuthors.length} posts processados com autores`
          );
        } else {
          setPosts(posts);
          console.log("ℹ️ Posts carregados sem autores (author_ids vazios)");
        }
      } else {
        setPosts([]);
        console.log("ℹ️ Nenhum post encontrado");
      }
    } catch (error) {
      console.error("💥 Erro inesperado:", error);
      toast.error("Erro inesperado ao carregar posts");
    } finally {
      setPostsLoading(false);
    }
  };

  const togglePublish = async (postId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("posts")
        .update({
          published: !currentStatus,
          published_at: !currentStatus ? new Date().toISOString() : null,
        })
        .eq("id", postId);

      if (error) {
        console.error("Erro ao alterar status do post:", error);
        toast.error("Erro ao alterar status do post");
        return;
      }

      // Atualizar a lista local
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                published: !currentStatus,
                published_at: !currentStatus ? new Date().toISOString() : null,
              }
            : post
        )
      );

      toast.success(
        `Post ${!currentStatus ? "publicado" : "despublicado"} com sucesso`
      );
      console.log(
        `✅ Post ${!currentStatus ? "publicado" : "despublicado"} com sucesso`
      );
    } catch (error) {
      console.error("Erro ao alterar publicação:", error);
      toast.error("Erro ao alterar publicação");
    }
  };

  const deletePost = async (postId: string, postTitle: string) => {
    if (!confirm(`Tem certeza que deseja excluir o post "${postTitle}"?`)) {
      return;
    }

    try {
      const { error } = await supabase.from("posts").delete().eq("id", postId);

      if (error) {
        console.error("Erro ao excluir post:", error);
        toast.error("Erro ao excluir post");
        return;
      }

      // Remover da lista local
      setPosts(posts.filter((post) => post.id !== postId));
      toast.success("Post excluído com sucesso");
      console.log("✅ Post excluído com sucesso");
    } catch (error) {
      console.error("Erro ao excluir post:", error);
      toast.error("Erro ao excluir post");
    }
  };

  // Filtrar posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all"
        ? true
        : filter === "published"
        ? post.published
        : filter === "draft"
        ? !post.published
        : true;

    return matchesSearch && matchesFilter;
  });

  // Estatísticas
  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.published).length,
    draft: posts.filter((p) => !p.published).length,
    recent: posts.filter((p) => {
      const postDate = new Date(p.created_at);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return postDate > weekAgo;
    }).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <Spinner size="lg" className="mx-auto" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Verificando acesso...</h2>
            <p className="text-muted-foreground">Carregando painel de posts</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
          <p className="mt-2">
            Você não tem permissão para acessar esta página.
          </p>
          <Button asChild className="mt-4">
            <a href="/">Voltar para Home</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-custom py-8">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link href="/admin">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Link>
              </Button>
              <div className="h-6 w-px bg-border"></div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <FileText className="h-8 w-8 text-green-600" />
                Gerenciar Posts
              </h1>
            </div>
            <p className="text-muted-foreground">
              Crie, edite e publique posts no blog da plataforma
            </p>
          </div>
          <Button asChild className="btn btn-primary gap-2">
            <Link href="/admin/posts/new">
              <Plus className="h-4 w-4" />
              Novo Post
            </Link>
          </Button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="text-center p-4 hover-lift">
            <CardContent className="p-0 space-y-2">
              <div className="text-2xl font-bold text-blue-600">
                {stats.total}
              </div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card className="text-center p-4 hover-lift">
            <CardContent className="p-0 space-y-2">
              <div className="text-2xl font-bold text-green-600">
                {stats.published}
              </div>
              <div className="text-sm text-muted-foreground">Publicados</div>
            </CardContent>
          </Card>
          <Card className="text-center p-4 hover-lift">
            <CardContent className="p-0 space-y-2">
              <div className="text-2xl font-bold text-orange-600">
                {stats.draft}
              </div>
              <div className="text-sm text-muted-foreground">Rascunhos</div>
            </CardContent>
          </Card>
          <Card className="text-center p-4 hover-lift">
            <CardContent className="p-0 space-y-2">
              <div className="text-2xl font-bold text-purple-600">
                {stats.recent}
              </div>
              <div className="text-sm text-muted-foreground">Esta semana</div>
            </CardContent>
          </Card>
        </div>

        {/* FILTROS E BUSCA */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex gap-2">
                  {[
                    { value: "all", label: "Todos" },
                    { value: "published", label: "Publicados" },
                    { value: "draft", label: "Rascunhos" },
                  ].map((filterOption) => (
                    <Button
                      key={filterOption.value}
                      variant={
                        filter === filterOption.value ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setFilter(filterOption.value as any)}
                      className="gap-2"
                    >
                      <Filter className="h-3 w-3" />
                      {filterOption.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Button variant="outline" size="sm" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* LISTA DE POSTS */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle>Posts ({filteredPosts.length})</CardTitle>
            <div className="text-sm text-muted-foreground">
              {filteredPosts.length} de {posts.length} posts
            </div>
          </CardHeader>
          <CardContent>
            {postsLoading ? (
              <div className="text-center py-12">
                <Spinner size="md" className="mx-auto mb-4" />
                <p className="text-muted-foreground">Carregando posts...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm || filter !== "all"
                    ? "Nenhum post encontrado"
                    : "Nenhum post criado"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || filter !== "all"
                    ? "Tente ajustar os filtros ou termos de busca"
                    : "Comece criando seu primeiro post"}
                </p>
                <Button asChild className="btn btn-primary">
                  <Link href="/admin/posts/new">
                    <Plus className="h-4 w-4" />
                    Criar Primeiro Post
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="h-6 w-6 text-white" />
                      </div>

                      <div className="flex-1 min-w-0 space-y-2">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>

                        {post.excerpt && (
                          <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                            {post.excerpt}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>
                              {post.author?.profiles?.full_name || "Autor"}
                            </span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(post.created_at).toLocaleDateString(
                                "pt-BR"
                              )}
                            </span>
                          </div>
                          {post.published_at && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>
                                  Publicado em{" "}
                                  {new Date(
                                    post.published_at
                                  ).toLocaleDateString("pt-BR")}
                                </span>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant={post.published ? "default" : "secondary"}
                            className="gap-1"
                          >
                            {post.published ? (
                              <>
                                <Eye className="h-3 w-3" />
                                Publicado
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3 w-3" />
                                Rascunho
                              </>
                            )}
                          </Badge>

                          <Badge variant="outline" className="text-xs">
                            {post.slug}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePublish(post.id, post.published)}
                        title={post.published ? "Despublicar" : "Publicar"}
                      >
                        {post.published ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>

                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/posts/${post.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deletePost(post.id, post.title)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
