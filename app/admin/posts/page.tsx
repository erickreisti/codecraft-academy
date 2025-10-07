// app/admin/posts/page.tsx
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminPostsPage() {
  // TODO: Buscar posts do banco de dados
  // const posts = []; Substituir por dados reais

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-custom py-8">
        <Card>
          <CardHeader>
            <CardTitle>Posts do Blog</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Lista de posts e botões de ação (criar, editar,
              publicar/despublicar) virão aqui.
            </p>
            {/* TODO: Implementar listagem e CRUD */}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
