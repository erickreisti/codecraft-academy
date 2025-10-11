// app/actions/admin-actions.ts - ARQUIVO COMPLETO UNIFICADO
"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ===== SCHEMAS DE VALIDAÇÃO =====
const courseSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  slug: z.string().min(3, "Slug deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  short_description: z.string().optional(),
  price: z.number().min(0, "Preço não pode ser negativo"),
  duration_hours: z.number().min(0, "Duração não pode ser negativa"),
  level: z.enum(["iniciante", "intermediario", "avancado"]),
  category: z.string().optional(),
  image_url: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
});

const postSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  slug: z.string().min(3, "Slug deve ter pelo menos 3 caracteres"),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  image_url: z.string().optional(),
  published: z.boolean().default(false),
  author_id: z.string(),
});

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

// ===== COURSE ACTIONS =====
export async function createCourse(formData: any) {
  try {
    const supabase = createAdminClient();

    // Validar dados
    const validatedData = courseSchema.parse(formData);
    console.log("📤 Criando curso (Server Action):", validatedData);

    const { data, error } = await supabase
      .from("courses")
      .insert([validatedData])
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

    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map((issue) => issue.message)
        .join(", ");
      return {
        success: false,
        error: `Dados inválidos: ${errorMessages}`,
      };
    }

    return {
      success: false,
      error: "Erro inesperado ao criar curso",
    };
  }
}

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

export async function updateCourse(courseId: string, formData: any) {
  try {
    const supabase = createAdminClient();

    // Validar dados
    const validatedData = courseSchema.parse(formData);
    console.log("📤 Atualizando curso:", courseId, validatedData);

    const { data, error } = await supabase
      .from("courses")
      .update(validatedData)
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

    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map((issue) => issue.message)
        .join(", ");
      return {
        success: false,
        error: `Dados inválidos: ${errorMessages}`,
      };
    }

    return {
      success: false,
      error: "Erro inesperado ao atualizar curso",
    };
  }
}

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

// ===== POST ACTIONS =====
export async function createPost(formData: any) {
  try {
    const supabase = createAdminClient();

    // Validar dados
    const validatedData = postSchema.parse(formData);
    console.log("📤 Criando post (Server Action):", validatedData);

    const { data, error } = await supabase
      .from("posts")
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      console.error("❌ Erro ao criar post:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log("✅ Post criado com sucesso:", data);

    // Atualizar cache
    revalidatePath("/admin/posts");
    revalidatePath("/blog");

    return {
      success: true,
      data,
      message: "Post criado com sucesso!",
    };
  } catch (error) {
    console.error("💥 Erro inesperado:", error);

    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map((issue) => issue.message)
        .join(", ");
      return {
        success: false,
        error: `Dados inválidos: ${errorMessages}`,
      };
    }

    return {
      success: false,
      error: "Erro inesperado ao criar post",
    };
  }
}

export async function getAdminPosts() {
  try {
    const supabase = createAdminClient();

    const { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Erro ao buscar posts:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: posts,
    };
  } catch (error) {
    console.error("💥 Erro inesperado:", error);
    return {
      success: false,
      error: "Erro inesperado ao buscar posts",
    };
  }
}

export async function getAdminPost(postId: string) {
  try {
    const supabase = createAdminClient();

    const { data: post, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", postId)
      .single();

    if (error) {
      console.error("❌ Erro ao buscar post:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: post,
    };
  } catch (error) {
    console.error("💥 Erro inesperado:", error);
    return {
      success: false,
      error: "Erro inesperado ao buscar post",
    };
  }
}

export async function updatePost(postId: string, formData: any) {
  try {
    const supabase = createAdminClient();

    // Validar dados
    const validatedData = postSchema.parse(formData);
    console.log("📤 Atualizando post:", postId, validatedData);

    const { data, error } = await supabase
      .from("posts")
      .update(validatedData)
      .eq("id", postId)
      .select()
      .single();

    if (error) {
      console.error("❌ Erro ao atualizar post:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log("✅ Post atualizado com sucesso:", data);

    // Atualizar cache
    revalidatePath("/admin/posts");
    revalidatePath("/blog");

    return {
      success: true,
      data,
      message: "Post atualizado com sucesso!",
    };
  } catch (error) {
    console.error("💥 Erro inesperado:", error);

    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map((issue) => issue.message)
        .join(", ");
      return {
        success: false,
        error: `Dados inválidos: ${errorMessages}`,
      };
    }

    return {
      success: false,
      error: "Erro inesperado ao atualizar post",
    };
  }
}

export async function deletePost(postId: string) {
  try {
    const supabase = createAdminClient();

    console.log("🗑️ Deletando post:", postId);

    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      console.error("❌ Erro ao deletar post:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log("✅ Post deletado com sucesso");

    // Atualizar cache
    revalidatePath("/admin/posts");
    revalidatePath("/blog");

    return {
      success: true,
      message: "Post deletado com sucesso!",
    };
  } catch (error) {
    console.error("💥 Erro inesperado:", error);
    return {
      success: false,
      error: "Erro inesperado ao deletar post",
    };
  }
}

export async function getPublishedPosts() {
  try {
    const supabase = createAdminClient();

    const { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("❌ Erro ao buscar posts publicados:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: posts,
    };
  } catch (error) {
    console.error("💥 Erro inesperado:", error);
    return {
      success: false,
      error: "Erro inesperado ao buscar posts",
    };
  }
}

// ===== PROFILE ACTIONS =====
export async function updateProfile(userId: string, formData: FormData) {
  try {
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

// ===== ADMIN VERIFICATION =====
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
