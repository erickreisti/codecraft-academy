// app/actions/profile-actions.ts
"use server"; // Indica que é uma Server Action (executa no servidor)

import { createServerClient } from "@/lib/supabase/server"; // Cliente Supabase para servidor
import { revalidatePath } from "next/cache"; // Função para limpar cache
import { redirect } from "next/navigation"; // Função para redirecionamento
import { z } from "zod"; // Biblioteca de validação de dados

/**
 * SERVER ACTION: Atualizar Perfil do Usuário
 *
 * Valida e atualiza os dados do perfil do usuário
 * Segurança: Verifica sessão, valida dados com Zod
 */

// Schema de validação com mensagens em português
const profileSchema = z.object({
  // Define formato esperado dos dados
  full_name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  bio: z.string().max(500, "Bio deve ter no máximo 500 caracteres").optional(),
  // Campo opcional com validação de tamanho
  website: z.string().url("URL deve ser válida").optional().or(z.literal("")),
  // URL opcional ou string vazia
});

export async function updateProfile(formData: FormData) {
  // Função assíncrona que recebe FormData
  const supabase = createServerClient(); // Cria cliente Supabase

  // 🔐 Validar sessão do usuário
  const {
    data: { session },
  } = await supabase.auth.getSession(); // Obtém sessão atual
  if (!session) {
    throw new Error("Não autorizado - faça login novamente");
    // Erro se não há sessão
  }

  try {
    // 📋 Validar dados do formulário
    const validatedData = profileSchema.parse({
      // Valida dados contra o schema
      full_name: formData.get("full_name"), // Obtém valor do campo
      bio: formData.get("bio"),
      website: formData.get("website"),
    });

    // 💾 Atualizar perfil no Supabase
    const { error } = await supabase.from("profiles").upsert({
      // Upsert = insert ou update
      id: session.user.id, // ID do usuário da sessão
      ...validatedData, // Dados validados
      updated_at: new Date().toISOString(), // Timestamp de atualização
    });

    if (error) {
      console.error("Erro Supabase:", error); // Log do erro
      throw new Error(`Erro ao atualizar perfil: ${error.message}`);
    }

    // 🔄 Atualizar cache e redirecionar
    revalidatePath("/dashboard/profile"); // Limpa cache da página de perfil
    redirect("/dashboard/profile?success=true"); // Redireciona com parâmetro de sucesso
  } catch (error) {
    if (error instanceof z.ZodError) {
      // 🚨 Erro de validação Zod - CORREÇÃO: usar 'issues' em vez de 'errors'
      const errorMessages = error.issues
        .map((issue: { message: string }) => issue.message) // Extrai mensagens
        .join(", "); // Junta em uma string
      throw new Error(`Dados inválidos: ${errorMessages}`);
    }
    throw error; // Repassar outros erros
  }
}
