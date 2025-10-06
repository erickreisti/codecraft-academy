// app/dashboard/profile/page.tsx
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
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
import { updateProfile } from "@/app/actions/profile-actions";

export default async function ProfilePage() {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-30">
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Meu Perfil</h1>
              <p className="text-muted-foreground">Gerencie suas informações</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/dashboard">← Voltar</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>Atualize suas informações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form action={updateProfile} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={session.user.email || ""}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground">
                      Email não pode ser alterado
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nome Completo</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      type="text"
                      defaultValue={profile?.full_name || ""}
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      defaultValue={profile?.bio || ""}
                      placeholder="Conte sobre você..."
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      defaultValue={profile?.website || ""}
                      placeholder="https://seusite.com"
                    />
                  </div>

                  <Button type="submit" className="btn btn-primary">
                    Salvar Alterações
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">ID do Usuário</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {session.user.id.substring(0, 8)}...
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium">Membro desde</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(session.user.created_at).toLocaleDateString(
                      "pt-BR"
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
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
                  <Link href="/dashboard/courses">📚 Meus Cursos</Link>
                </Button>

                <form action="/auth/signout" method="POST">
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    🚪 Sair
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
