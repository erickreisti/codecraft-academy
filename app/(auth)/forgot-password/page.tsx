/**
 * PÁGINA DE RECUPERAÇÃO DE SENHA - CodeCraft Academy
 *
 * Permite que usuários solicitem redefinição de senha
 * Envia email com link para criar nova senha
 * Integrado com Supabase Auth
 */

"use client"; // Necessário para hooks e estado - indica que é um componente React do lado do cliente

import { useState } from "react"; // Importa hook para gerenciar estado
import Link from "next/link"; // Componente para navegação entre páginas
import { Button } from "@/components/ui/button"; // Componente de botão personalizado
import { Input } from "@/components/ui/input"; // Componente de input personalizado
import { Label } from "@/components/ui/label"; // Componente de label personalizado
import { supabase } from "@/lib/supabase/client"; // Cliente do Supabase para autenticação

export default function ForgotPasswordPage() {
  // Estados do formulário
  const [email, setEmail] = useState(""); // Estado para armazenar o email digitado
  const [loading, setLoading] = useState(false); // Estado para controlar carregamento
  const [error, setError] = useState(""); // Estado para mensagens de erro
  const [success, setSuccess] = useState(false); // Controla estado de sucesso após envio

  /**
   * FUNÇÃO DE SOLICITAÇÃO DE REDEFINIÇÃO
   * Envia email com link para redefinir senha
   */
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne comportamento padrão do formulário
    setLoading(true); // Ativa estado de carregamento
    setError(""); // Limpa erros anteriores
    setSuccess(false); // Reseta estado de sucesso

    try {
      // Solicita redefinição de senha via Supabase Auth
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // URL para onde usuário será redirecionado após clicar no email
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setError(error.message); // Exibe erro se houver
      } else {
        // Mostra mensagem de sucesso (mesmo se email não existir, por segurança)
        setSuccess(true); // Ativa estado de sucesso
      }
    } catch {
      setError("Erro ao solicitar redefinição de senha"); // Erro genérico em caso de falha
    } finally {
      setLoading(false); // Desativa carregamento independente do resultado
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Container principal que ocupa tela toda e centraliza conteúdo */}
      <div className="max-w-md w-full space-y-8">
        {/* Container com largura máxima e espaçamento entre elementos */}

        {/* CABEÇALHO DA PÁGINA */}
        <div className="text-center">
          {/* Logo clicável para voltar à home */}
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            {/* Container do logo */}
            <div className="h-10 w-10 gradient-bg rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-2xl gradient-text">CodeCraft</span>
          </Link>

          {/* Título e descrição */}
          <h1 className="text-3xl font-bold">Redefinir Senha</h1>
          <p className="text-muted-foreground mt-2">
            Enviaremos um link para criar uma nova senha
          </p>
        </div>

        {/* CONDICIONAL: Mostra formulário OU mensagem de sucesso */}
        {!success ? ( // Se NÃO houve sucesso, mostra formulário
          // FORMULÁRIO DE SOLICITAÇÃO
          <form onSubmit={handleResetPassword} className="space-y-6">
            {/* EXIBIÇÃO DE ERROS */}
            {error && ( // Se há erro, exibe mensagem
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* EXPLICAÇÃO PARA O USUÁRIO */}
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
              <p>
                Digite seu email e enviaremos um link para redefinir sua senha.
                O link expira em 24 horas.
              </p>
            </div>

            {/* CAMPO EMAIL */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Atualiza estado com valor digitado
                required
              />
            </div>

            {/* BOTÃO DE ENVIO */}
            <Button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading} // Desabilita botão durante carregamento
            >
              {loading ? "Enviando..." : "Enviar Link de Redefinição"}
            </Button>
          </form>
        ) : (
          // Se HOUVE sucesso, mostra mensagem
          // MENSAGEM DE SUCESSO
          <div className="text-center space-y-6">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">✅</span>
                <span className="font-semibold">Email enviado!</span>
              </div>
              <p className="text-sm">
                Enviamos um link de redefinição para <strong>{email}</strong>.
                Verifique sua caixa de entrada e pasta de spam.
              </p>
            </div>

            {/* INSTRUÇÕES ADICIONAIS */}
            <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
              <p className="font-semibold mb-2">📋 Próximos passos:</p>
              <ul className="space-y-1 text-left">
                <li>• Verifique seu email</li>
                <li>• Clique no link de redefinição</li>
                <li>• Crie uma nova senha</li>
                <li>• Faça login com a nova senha</li>
              </ul>
            </div>
          </div>
        )}

        {/* LINKS DE NAVEGAÇÃO */}
        <div className="text-center space-y-4">
          {/* Link para voltar ao login */}
          <Link href="/login" className="block text-primary hover:underline">
            ← Voltar para o login
          </Link>

          {/* Link para criar nova conta (apenas se não tiver sucesso) */}
          {!success && ( // Só mostra link de cadastro se não houve sucesso
            <Link
              href="/register"
              className="block text-muted-foreground hover:underline text-sm"
            >
              Não tem conta? Cadastre-se
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
