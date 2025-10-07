// app/actions/profile-actions.ts - VERSÃO SEM REDIRECT
"use server";

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
  full_name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  bio: z.string().max(500, "Bio deve ter no máximo 500 caracteres").optional(),
  website: z.string().url("URL deve ser válida").optional().or(z.literal("")),
});

// ✅ RETORNA resultado em vez de redirecionar
export async function updateProfile(userId: string, formData: FormData) {
  const supabase = createServerClient();

  try {
    // 📋 Validar dados
    const validatedData = profileSchema.parse({
      full_name: formData.get("full_name"),
      bio: formData.get("bio"),
      website: formData.get("website"),
    });

    // 💾 Atualizar perfil
    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      ...validatedData,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Erro Supabase:", error);
      return { success: false, error: error.message };
    }

    // 🔄 Atualizar cache apenas
    revalidatePath("/dashboard/profile");

    // ✅ Retornar sucesso sem redirecionar
    return {
      success: true,
      message: "Perfil atualizado com sucesso!",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map((issue: { message: string }) => issue.message)
        .join(", ");
      return { success: false, error: `Dados inválidos: ${errorMessages}` };
    }
    return { success: false, error: "Erro desconhecido" };
  }
}
