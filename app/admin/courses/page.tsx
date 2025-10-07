// app/admin/courses/page.tsx
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminCoursesPage() {
  // TODO: Buscar cursos do banco de dados
  //const courses = [];  Substituir por dados reais

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-custom py-8">
        <Card>
          <CardHeader>
            <CardTitle>Cursos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Lista de cursos e botões de ação (criar, editar, deletar) virão
              aqui.
            </p>
            {/* TODO: Implementar listagem e CRUD */}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
