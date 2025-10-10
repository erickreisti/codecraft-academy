// lib/utils/admin.ts
import { createClient } from "@supabase/supabase-js";

export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (!profile) return false;

    const role = profile.role;
    return (
      role === "admin" ||
      role === "ADMIN" ||
      (typeof role === "string" && role.toLowerCase() === "admin")
    );
  } catch (error) {
    console.error("Erro ao verificar admin:", error);
    return false;
  }
}
