import Link from "next/link"; // Componente para navegação entre páginas
import { Button } from "@/components/ui/button"; // Componente de botão personalizado
import { Header } from "@/components/layout/header"; // Componente de cabeçalho

export default function NotFound() {
  // Componente para página 404
  return (
    <div className="min-h-screen bg-background">
      {/* Container principal ocupando altura mínima da tela */}
      <Header /> {/* Renderiza o cabeçalho do site */}
      <section className="section-py">
        {/* Seção com padding vertical padrão */}
        <div className="container-custom">
          {/* Container com largura máxima e padding */}
          <div className="text-center max-w-3xl mx-auto">
            {/* Container centralizado com largura máxima */}

            {/* Design Mais Criativo */}
            <div className="relative mb-12">
              {/* Container relativo para posicionamento absoluto interno */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Elemento absoluto que cobre todo o container pai */}
                <div className="text-9xl font-bold text-muted/20 select-none">
                  {/* Número 404 grande e semitransparente */}
                  404
                </div>
              </div>

              <div className="relative z-10">
                {/* Conteúdo principal com z-index maior */}
                <div className="text-8xl mb-6">👨‍💻</div>
                {/* Emoji grande de desenvolvedor */}
                <h1 className="text-5xl font-bold mb-4">
                  Página em <span className="gradient-text">Modo Debug</span>
                  {/* Título com parte do texto em gradiente */}
                </h1>
              </div>
            </div>

            {/* Mensagem Engajadora */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-8 mb-8 border">
              {/* Card com gradiente que muda no modo escuro */}
              <p className="text-xl text-muted-foreground mb-4">
                {/* Mensagem principal */}
                <span className="font-semibold text-foreground">
                  {/* Texto que simula código JavaScript */}
                  Console.log(&apos;Página não encontrada!&apos;);
                </span>
                <br />
                {/* Quebra de linha */}
                Parece que este endpoint retornou um 404. Mas não se preocupe,
                todo dev já passou por isso! 🐛
                {/* Mensagem descontraída com emoji de bug */}
              </p>

              <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-full text-sm">
                {/* Badge de aviso com estilo amarelo */}
                <span>⚠️</span>
                {/* Ícone de aviso */}
                <span>Status: 404 - Not Found</span>
                {/* Texto do status HTTP */}
              </div>
            </div>

            {/* Botões de Ação - Grid de cards clicáveis */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
              {/* Grid que vira 3 colunas em telas pequenas */}

              {/* Card para Home */}
              <Link href="/" className="block">
                {/* Link para página inicial */}
                <div className="feature-card text-center p-6 group hover:scale-105 transition-transform">
                  {/* Card com efeito hover de escala */}
                  <div className="text-3xl mb-3">🏠</div>
                  {/* Emoji de casa */}
                  <h3 className="font-semibold mb-2">Home</h3>
                  {/* Título do card */}
                  <p className="text-sm text-muted-foreground">
                    Voltar ao início
                  </p>
                  {/* Descrição */}
                </div>
              </Link>

              {/* Card para Cursos */}
              <Link href="/courses" className="block">
                <div className="feature-card text-center p-6 group hover:scale-105 transition-transform">
                  <div className="text-3xl mb-3">📚</div>
                  {/* Emoji de livros */}
                  <h3 className="font-semibold mb-2">Cursos</h3>
                  <p className="text-sm text-muted-foreground">
                    Aprenda programação
                  </p>
                </div>
              </Link>

              {/* Card para Blog */}
              <Link href="/blog" className="block">
                <div className="feature-card text-center p-6 group hover:scale-105 transition-transform">
                  <div className="text-3xl mb-3">📝</div>
                  {/* Emoji de bloco de notas */}
                  <h3 className="font-semibold mb-2">Blog</h3>
                  <p className="text-sm text-muted-foreground">
                    Leia nossos artigos
                  </p>
                </div>
              </Link>
            </div>

            {/* CTA Principal - Call to Action final */}
            <div className="border-t pt-8">
              {/* Divisória com padding no topo */}
              <p className="text-muted-foreground mb-6">
                Enquanto isso, que tal explorar nossa plataforma?
                {/* Texto convidativo */}
              </p>
              <Link href="/">
                {/* Link para home */}
                <Button className="btn btn-primary btn-lg">
                  {/* Botão grande e primário */}
                  🚀 Explorar CodeCraft Academy
                  {/* Texto com emoji de foguete */}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
