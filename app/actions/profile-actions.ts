// app/actions/profile-actions.ts - VERSÃO CORRIGIDA
"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const profileSchema = z.object({
  full_name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  bio: z.string().max(500, "Bio deve ter no máximo 500 caracteres").optional(),
  website: z.string().url("URL deve ser válida").optional().or(z.literal("")),
});

// ✅ MUDANÇA: Receber userId explicitamente
export async function updateProfile(userId: string, formData: FormData) {
  const supabase = createServerClient();

  try {
    // 📋 Validar dados do formulário
    const validatedData = profileSchema.parse({
      full_name: formData.get("full_name"),
      bio: formData.get("bio"),
      website: formData.get("website"),
    });

    // 💾 Atualizar perfil no Supabase
    const { error } = await supabase.from("profiles").upsert({
      id: userId, // ✅ Usar userId passado como parâmetro
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
    // ✅ CORREÇÃO: Usar 'issues' em vez de 'errors'
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map((issue: { message: string }) => issue.message)
        .join(", ");
      throw new Error(`Dados inválidos: ${errorMessages}`);
    }
    throw error; // Repassar outros erros
  }
}
