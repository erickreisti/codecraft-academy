/**
 * UTILITÁRIOS DE UPLOAD - Supabase Storage
 *
 * Funções especializadas para upload em cada pasta:
 * - courses/ → Imagens de cursos
 * - posts/ → Capas de posts
 * - avatars/ → Avatares de usuários
 */

import { supabase } from "@/lib/supabase/client";

// Tipos de arquivo permitidos
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

// Tamanho máximo: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Valida arquivo antes do upload
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Verifica tipo
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Tipo de arquivo não permitido. Use JPEG, PNG, WebP ou GIF.",
    };
  }

  // Verifica tamanho
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "Arquivo muito grande. Máximo 5MB.",
    };
  }

  return { valid: true };
}

/**
 * Gera nome único para arquivo
 */
function generateFileName(userId: string, originalName: string): string {
  const timestamp = Date.now();
  const extension = originalName.split(".").pop();
  const randomId = Math.random().toString(36).substring(2, 9);

  return `${userId}_${timestamp}_${randomId}.${extension}`;
}

/**
 * Upload genérico para qualquer pasta
 */
async function uploadToBucket(
  file: File,
  bucket: string,
  folder: string,
  userId: string
): Promise<{ url: string; error?: string }> {
  try {
    // Valida arquivo
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return { url: "", error: validation.error };
    }

    // Gera nome único
    const fileName = generateFileName(userId, file.name);
    const filePath = `${folder}/${fileName}`;

    console.log(`📤 Uploading to: ${bucket}/${filePath}`);

    // Faz upload
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false, // Não sobrescreve arquivos existentes
      });

    if (error) {
      console.error("❌ Erro no upload:", error);
      return { url: "", error: error.message };
    }

    // Obtém URL pública
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    console.log("✅ Upload realizado:", publicUrl);
    return { url: publicUrl };
  } catch (error) {
    console.error("💥 Erro inesperado no upload:", error);
    return { url: "", error: "Erro inesperado no upload" };
  }
}

/**
 * 🎯 UPLOAD DE IMAGEM DE CURSO
 */
export async function uploadCourseImage(
  file: File,
  userId: string
): Promise<{ url: string; error?: string }> {
  return uploadToBucket(file, "course-images", "courses", userId);
}

/**
 * 📝 UPLOAD DE CAPA DE POST
 */
export async function uploadPostImage(
  file: File,
  userId: string
): Promise<{ url: string; error?: string }> {
  return uploadToBucket(file, "course-images", "posts", userId);
}

/**
 * 👤 UPLOAD DE AVATAR
 */
export async function uploadAvatar(
  file: File,
  userId: string
): Promise<{ url: string; error?: string }> {
  return uploadToBucket(file, "course-images", "avatars", userId);
}

/**
 * 🗑️ DELETAR ARQUIVO
 */
export async function deleteImage(
  fileUrl: string
): Promise<{ error?: string }> {
  try {
    // Extrai caminho do arquivo da URL
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split("/");
    const filePath = pathParts.slice(-2).join("/"); // Pega "pasta/arquivo"

    const { error } = await supabase.storage
      .from("course-images")
      .remove([filePath]);

    if (error) {
      console.error("❌ Erro ao deletar:", error);
      return { error: error.message };
    }

    console.log("✅ Arquivo deletado:", filePath);
    return {};
  } catch (error) {
    console.error("💥 Erro ao deletar arquivo:", error);
    return { error: "Erro ao deletar arquivo" };
  }
}
