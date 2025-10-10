// components/ui/course-image.tsx - VERSÃO COMPLETA CORRIGIDA
"use client";

import { useState } from "react";
import Image from "next/image";
import { forwardRef } from "react";

interface CourseImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

// ✅ Usar forwardRef para evitar warnings
const CourseImage = forwardRef<HTMLDivElement, CourseImageProps>(
  ({ src, alt, className = "" }, ref) => {
    const [imageError, setImageError] = useState(false);

    // Se não tem src ou deu erro, mostra placeholder
    if (!src || imageError) {
      return (
        <div
          ref={ref}
          className={`w-full h-48 flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg ${className}`}
        >
          <span className="text-4xl">📚</span>
        </div>
      );
    }

    // ✅ CORREÇÃO: Container com position relative e dimensões + sizes
    return (
      <div ref={ref} className={`relative w-full h-48 ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover rounded-lg"
          onError={() => setImageError(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false} // ✅ Evitar warning LCP
        />
      </div>
    );
  }
);

CourseImage.displayName = "CourseImage";
export { CourseImage };
