// app/admin/posts/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

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
}

export default function AdminPostsPage() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
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
      const { data: posts, error } = await supabase
        .from("posts")
        .select(
          "id, title, slug, excerpt, published, published_at, author_id, created_at, updated_at"
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar posts:", error);
        return;
      }

      setPosts(posts || []);
      console.log(`📝 ${posts?.length || 0} posts carregados`);
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
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

      console.log(
        `✅ Post ${!currentStatus ? "publicado" : "despublicado"} com sucesso`
      );
    } catch (error) {
      console.error("Erro ao alterar publicação:", error);
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
        return;
      }

      // Remover da lista local
      setPosts(posts.filter((post) => post.id !== postId));
      console.log("✅ Post excluído com sucesso");
    } catch (error) {
      console.error("Erro ao excluir post:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p>Verificando acesso...</p>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Posts do Blog</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Gerencie os posts do blog da plataforma
              </p>
            </div>
            <Button asChild className="btn btn-primary">
              <Link href="/admin/posts/new">Novo Post</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {postsLoading ? (
              <div className="text-center py-8">
                <Spinner size="md" className="mx-auto mb-2" />
                <p className="text-muted-foreground">Carregando posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum post encontrado.</p>
                <Button asChild className="mt-4">
                  <Link href="/admin/posts/new">Criar Primeiro Post</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {post.excerpt || "Sem descrição"}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>Slug: {post.slug}</span>
                          <span>•</span>
                          <span>
                            {post.published ? (
                              <span className="text-green-600 font-medium">
                                Publicado
                              </span>
                            ) : (
                              <span className="text-orange-600 font-medium">
                                Rascunho
                              </span>
                            )}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(post.updated_at).toLocaleDateString(
                              "pt-BR"
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePublish(post.id, post.published)}
                        >
                          {post.published ? "Despublicar" : "Publicar"}
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/posts/${post.id}/edit`}>
                            Editar
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deletePost(post.id, post.title)}
                        >
                          Excluir
                        </Button>
                      </div>
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
