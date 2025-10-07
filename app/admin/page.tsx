// app/admin/page.tsx
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-custom py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>
          <p className="text-muted-foreground mb-8">
            Gerencie os cursos e posts da plataforma.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button asChild className="btn btn-primary">
              <Link href="/admin/courses">Gerenciar Cursos</Link>
            </Button>
            <Button asChild className="btn btn-secondary">
              <Link href="/admin/posts">Gerenciar Posts</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
