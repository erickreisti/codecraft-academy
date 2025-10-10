"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ✅ Criar post
export async function createPost(formData: any) {
  try {
    const supabase = createAdminClient();

    console.log("📤 Criando post (Server Action):", formData);

    const { data, error } = await supabase
      .from("posts")
      .insert([formData])
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
    return {
      success: false,
      error: "Erro inesperado ao criar post",
    };
  }
}

// ✅ Buscar todos os posts (admin)
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

// ✅ Buscar post específico (admin)
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

// ✅ Atualizar post
export async function updatePost(postId: string, formData: any) {
  try {
    const supabase = createAdminClient();

    console.log("📤 Atualizando post:", postId, formData);

    const { data, error } = await supabase
      .from("posts")
      .update(formData)
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
    return {
      success: false,
      error: "Erro inesperado ao atualizar post",
    };
  }
}

// ✅ Deletar post
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

// ✅ Buscar posts publicados (página pública)
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
