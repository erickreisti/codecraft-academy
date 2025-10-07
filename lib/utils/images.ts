// lib/utils/images.ts
/**
 * UTILITÁRIOS PARA IMAGENS
 *
 * Funções auxiliares para gerenciamento seguro de imagens
 */

// Placeholders por categoria
export const getCoursePlaceholder = (category?: string) => {
  const placeholders = {
    frontend: "💻",
    backend: "⚙️",
    fullstack: "🚀",
    mobile: "📱",
    design: "🎨",
    default: "📚",
  };

  return (
    placeholders[category as keyof typeof placeholders] || placeholders.default
  );
};

// URL de imagem padrão
export const getSafeImageUrl = (url?: string | null) => {
  if (!url) return null;

  // Verifica se é uma URL válida
  try {
    new URL(url);
    return url;
  } catch {
    return null;
  }
};
