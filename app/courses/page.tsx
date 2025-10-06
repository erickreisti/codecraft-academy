/**
 * PÁGINA DE CURSOS - CodeCraft Academy
 *
 * Esta página exibe todos os cursos disponíveis da plataforma
 * Os dados são buscados em tempo real do Supabase
 */

// Importações de componentes e utilitários
import { Header } from "@/components/layout/header";
import { createServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

// Função principal da página (Server Component)
export default async function CoursesPage() {
  /**
   * 1. CONEXÃO COM O BANCO DE DADOS
   * Cria uma instância do cliente Supabase para operações no servidor
   * Isso garante melhor performance e SEO
   */
  const supabase = createServerClient();

  /**
   * 2. BUSCA DE DADOS NO SUPABASE
   * Query que busca todos os cursos publicados, ordenados por data de criação
   * .eq('published', true) - Filtra apenas cursos publicados
   * .order('created_at') - Ordena do mais recente para o mais antigo
   */
  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  /**
   * 3. TRATAMENTO DE ERROS
   * Se houver erro na conexão com o banco, exibe uma mensagem amigável
   * Isso evita que a aplicação quebre completamente
   */
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="section-py">
          <div className="container-custom text-center">
            <h1 className="text-2xl font-bold text-red-600">
              Erro ao carregar cursos
            </h1>
            <p className="text-muted-foreground mt-2">
              Tente recarregar a página ou entre em contato com o suporte
            </p>
          </div>
        </div>
      </div>
    );
  }

  /**
   * 4. FUNÇÃO AUXILIAR - CORES DOS BADGES
   * Define cores diferentes para cada nível de dificuldade
   * Melhora a experiência visual e usabilidade
   */
  const getLevelColor = (level: string) => {
    switch (level) {
      case "iniciante":
        return { bg: "#dcfce7", text: "#166534" }; // Verde
      case "intermediario":
        return { bg: "#fef9c3", text: "#854d0e" }; // Amarelo
      case "avancado":
        return { bg: "#fee2e2", text: "#991b1b" }; // Vermelho
      default:
        return { bg: "#e5e7eb", text: "#374151" }; // Cinza
    }
  };

  /**
   * 5. RENDERIZAÇÃO DA PÁGINA
   * Estrutura principal com Header, conteúdo e grid de cursos
   */
  return (
    <div className="min-h-screen bg-background">
      {/* Header com navegação */}
      <Header />

      {/* Seção principal de cursos */}
      <section className="section-py">
        <div className="container-custom">
          {/* Cabeçalho da página */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Nossos <span className="gradient-text">Cursos</span>
            </h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              Escolha o curso ideal para sua jornada em programação
            </p>
          </div>

          {/* Grid de cursos responsivo */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Verificação se existem cursos */}
            {courses && courses.length > 0 ? (
              // Mapeia cada curso para um card
              courses.map((course) => {
                const levelColor = getLevelColor(course.level);

                return (
                  /**
                   * 6. CARD INDIVIDUAL DO CURSO
                   * Componente reutilizável com hover effects e transições
                   * feature-card: Classe CSS personalizada do nosso design system
                   */
                  <div key={course.id} className="feature-card group">
                    {/* Banner do curso com gradiente */}
                    <div className="h-48 w-full gradient-bg rounded-t-lg flex items-center justify-center">
                      <span className="text-white text-4xl">💻</span>
                    </div>

                    {/* Conteúdo informativo do card */}
                    <div className="p-6">
                      {/* Badge de nível com cor dinâmica */}
                      <div
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-3 capitalize"
                        style={{
                          backgroundColor: levelColor.bg,
                          color: levelColor.text,
                        }}
                      >
                        {course.level}
                      </div>

                      {/* Título e descrição do curso */}
                      <h3 className="font-bold text-xl mb-3">{course.title}</h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {course.short_description || course.description}
                      </p>

                      {/* Metadados do curso */}
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <span className="mr-4">
                          ⏱️ {course.duration_hours}h
                        </span>
                        <span>📚 {course.category}</span>
                      </div>

                      {/* Área de preço e ação */}
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-bold text-2xl text-primary block">
                            R$ {course.price}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ou 12x sem juros
                          </span>
                        </div>
                        {/* Botão de call-to-action */}
                        <Button className="btn btn-primary">Ver Curso</Button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              /**
               * 7. ESTADO VAZIO
               * Exibido quando não há cursos ou durante carregamento
               */
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-2">
                  Nenhum curso encontrado
                </h3>
                <p className="text-muted-foreground">
                  Em breve teremos novos cursos disponíveis
                </p>
              </div>
            )}
          </div>

          {/* Seção de estatísticas */}
          <div className="mt-16 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold gradient-text mb-2">
                  {courses?.length || 0}+
                </div>
                <div className="text-muted-foreground">Cursos Disponíveis</div>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text mb-2">
                  5.000+
                </div>
                <div className="text-muted-foreground">Alunos Formados</div>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text mb-2">98%</div>
                <div className="text-muted-foreground">Satisfação</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
