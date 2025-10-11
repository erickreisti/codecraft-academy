// lib/utils/admin.ts - VERSÃO OTIMIZADA
import { createClient } from "@supabase/supabase-js";

export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    // Validação adicional de input
    if (!userId || typeof userId !== "string") {
      console.warn("⚠️ ID de usuário inválido:", userId);
      return false;
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { persistSession: false },
      }
    );

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("❌ Erro ao buscar perfil:", error);
      return false;
    }

    if (!profile) {
      console.warn("⚠️ Perfil não encontrado para usuário:", userId);
      return false;
    }

    const role = profile.role;
    const isAdmin =
      role === "admin" ||
      role === "ADMIN" ||
      (typeof role === "string" && role.toLowerCase() === "admin");

    console.log(
      `🔐 Verificação admin: ${userId} -> ${isAdmin} (role: ${role})`
    );
    return isAdmin;
  } catch (error) {
    console.error("💥 Erro inesperado ao verificar admin:", error);
    return false;
  }
}
