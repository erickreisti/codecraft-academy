// app/actions/admin-actions.ts
"use server";

import { createAdminClient } from "@/lib/supabase/admin-client";

export async function checkUserAdmin(userId: string): Promise<{
  isAdmin: boolean;
  error?: string;
  role?: string;
}> {
  try {
    if (!userId) {
      return { isAdmin: false, error: "User ID é obrigatório" };
    }

    console.log("🔍 Verificando admin para usuário:", userId);

    const supabase = createAdminClient();

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("❌ Erro ao buscar perfil:", error);
      return { isAdmin: false, error: error.message };
    }

    if (!profile) {
      return { isAdmin: false, error: "Perfil não encontrado" };
    }

    const role = profile.role;
    const isAdmin =
      role === "admin" ||
      role === "ADMIN" ||
      (typeof role === "string" && role.toLowerCase() === "admin");

    console.log(
      `🔐 Verificação admin: ${userId} -> ${isAdmin} (role: ${role})`
    );
    return { isAdmin, role };
  } catch (error: any) {
    console.error("💥 Erro inesperado ao verificar admin:", error);
    return { isAdmin: false, error: error.message };
  }
}
