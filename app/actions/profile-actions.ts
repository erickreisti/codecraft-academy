// app/actions/profile-actions.ts - VERSÃO UNIVERSAL
"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema de validação
const profileSchema = z.object({
  full_name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .optional(),
  bio: z
    .string()
    .max(500, "Bio deve ter no máximo 500 caracteres")
    .optional()
    .or(z.literal("")),
  website: z.string().url("URL deve ser válida").optional().or(z.literal("")),
});

// ✅ SERVER ACTION UNIVERSAL - funciona para alunos e admins
export async function updateProfile(userId: string, formData: FormData) {
  try {
    // Usar cliente admin para ignorar RLS e funcionar sempre
    const supabase = createAdminClient();

    // 📋 Validar dados do formulário
    const validatedData = profileSchema.parse({
      full_name: formData.get("full_name") || "",
      bio: formData.get("bio") || "",
      website: formData.get("website") || "",
    });

    console.log("🔄 Atualizando perfil para usuário:", userId);
    console.log("📦 Dados validados:", validatedData);

    // 💾 Atualizar perfil com SERVICE_ROLE_KEY (ignora RLS)
    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("❌ Erro ao atualizar perfil:", error);
      return {
        success: false,
        error: `Erro no banco de dados: ${error.message}`,
      };
    }

    console.log("✅ Perfil atualizado com sucesso:", data);

    // 🔄 Atualizar cache das páginas de perfil
    revalidatePath("/dashboard/profile");
    revalidatePath("/profile");

    // ✅ Retornar sucesso com dados atualizados
    return {
      success: true,
      message: "Perfil atualizado com sucesso!",
      profile: data,
    };
  } catch (error) {
    console.error("💥 Erro no server action:", error);

    // Tratar erros de validação Zod
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map((issue) => issue.message)
        .join(", ");
      return {
        success: false,
        error: `Dados inválidos: ${errorMessages}`,
      };
    }

    // Erro genérico
    return {
      success: false,
      error: "Erro interno do servidor. Tente novamente.",
    };
  }
}

// ✅ SERVER ACTION PARA BUSCAR PERFIL (opcional)
export async function getProfile(userId: string) {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Erro ao buscar perfil:", error);
      return { success: false, error: error.message };
    }

    return { success: true, profile: data };
  } catch (error) {
    console.error("Erro:", error);
    return { success: false, error: "Erro ao buscar perfil" };
  }
}
