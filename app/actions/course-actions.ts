"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ✅ Criar curso
export async function createCourse(formData: any) {
  try {
    const supabase = createAdminClient();

    console.log("📤 Criando curso (Server Action):", formData);

    const { data, error } = await supabase
      .from("courses")
      .insert([formData])
      .select()
      .single();

    if (error) {
      console.error("❌ Erro ao criar curso:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log("✅ Curso criado com sucesso:", data);

    // Atualizar cache
    revalidatePath("/admin/courses");
    revalidatePath("/courses");

    return {
      success: true,
      data,
      message: "Curso criado com sucesso!",
    };
  } catch (error) {
    console.error("💥 Erro inesperado:", error);
    return {
      success: false,
      error: "Erro inesperado ao criar curso",
    };
  }
}

// ✅ Buscar todos os cursos (admin)
export async function getAdminCourses() {
  try {
    const supabase = createAdminClient();

    const { data: courses, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Erro ao buscar cursos:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: courses,
    };
  } catch (error) {
    console.error("💥 Erro inesperado:", error);
    return {
      success: false,
      error: "Erro inesperado ao buscar cursos",
    };
  }
}

// ✅ Buscar curso específico (admin)
export async function getAdminCourse(courseId: string) {
  try {
    const supabase = createAdminClient();

    const { data: course, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();

    if (error) {
      console.error("❌ Erro ao buscar curso:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: course,
    };
  } catch (error) {
    console.error("💥 Erro inesperado:", error);
    return {
      success: false,
      error: "Erro inesperado ao buscar curso",
    };
  }
}

// ✅ Atualizar curso
export async function updateCourse(courseId: string, formData: any) {
  try {
    const supabase = createAdminClient();

    console.log("📤 Atualizando curso:", courseId, formData);

    const { data, error } = await supabase
      .from("courses")
      .update(formData)
      .eq("id", courseId)
      .select()
      .single();

    if (error) {
      console.error("❌ Erro ao atualizar curso:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log("✅ Curso atualizado com sucesso:", data);

    // Atualizar cache
    revalidatePath("/admin/courses");
    revalidatePath("/courses");

    return {
      success: true,
      data,
      message: "Curso atualizado com sucesso!",
    };
  } catch (error) {
    console.error("💥 Erro inesperado:", error);
    return {
      success: false,
      error: "Erro inesperado ao atualizar curso",
    };
  }
}

// ✅ Deletar curso
export async function deleteCourse(courseId: string) {
  try {
    const supabase = createAdminClient();

    console.log("🗑️ Deletando curso:", courseId);

    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", courseId);

    if (error) {
      console.error("❌ Erro ao deletar curso:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log("✅ Curso deletado com sucesso");

    // Atualizar cache
    revalidatePath("/admin/courses");
    revalidatePath("/courses");

    return {
      success: true,
      message: "Curso deletado com sucesso!",
    };
  } catch (error) {
    console.error("💥 Erro inesperado:", error);
    return {
      success: false,
      error: "Erro inesperado ao deletar curso",
    };
  }
}

// ✅ Buscar cursos publicados (página pública)
export async function getPublishedCourses() {
  try {
    const supabase = createAdminClient();

    const { data: courses, error } = await supabase
      .from("courses")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Erro ao buscar cursos publicados:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: courses,
    };
  } catch (error) {
    console.error("💥 Erro inesperado:", error);
    return {
      success: false,
      error: "Erro inesperado ao buscar cursos",
    };
  }
}
