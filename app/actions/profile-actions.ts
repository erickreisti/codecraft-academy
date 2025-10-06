// app/actions/profile-actions.ts
"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

/**
 * SERVER ACTION: Atualizar Perfil do Usuário
 *
 * Valida e atualiza os dados do perfil do usuário
 * Segurança: Verifica sessão, valida dados com Zod
 */

// Schema de validação com mensagens em português
const profileSchema = z.object({
  full_name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  bio: z.string().max(500, "Bio deve ter no máximo 500 caracteres").optional(),
  website: z.string().url("URL deve ser válida").optional().or(z.literal("")),
});

export async function updateProfile(formData: FormData) {
  const supabase = createServerClient();

  // 🔐 Validar sessão do usuário
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("Não autorizado - faça login novamente");
  }

  try {
    // 📋 Validar dados do formulário
    const validatedData = profileSchema.parse({
      full_name: formData.get("full_name"),
      bio: formData.get("bio"),
      website: formData.get("website"),
    });

    // 💾 Atualizar perfil no Supabase
    const { error } = await supabase.from("profiles").upsert({
      id: session.user.id,
      ...validatedData,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Erro Supabase:", error);
      throw new Error(`Erro ao atualizar perfil: ${error.message}`);
    }

    // 🔄 Atualizar cache e redirecionar
    revalidatePath("/dashboard/profile");
    redirect("/dashboard/profile?success=true");
  } catch (error) {
    if (error instanceof z.ZodError) {
      // 🚨 Erro de validação Zod - CORREÇÃO: usar 'issues' em vez de 'errors'
      const errorMessages = error.issues
        .map((issue: { message: string }) => issue.message)
        .join(", ");
      throw new Error(`Dados inválidos: ${errorMessages}`);
    }
    throw error; // Repassar outros erros
  }
}
