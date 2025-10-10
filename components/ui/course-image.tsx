"use client";

import { useState } from "react";
import Image from "next/image";

interface CourseImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export function CourseImage({ src, alt, className = "" }: CourseImageProps) {
  const [imageError, setImageError] = useState(false);

  // Se não tem src ou deu erro, mostra placeholder
  if (!src || imageError) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10 ${className}`}
      >
        <span className="text-4xl">📚</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={`object-cover ${className}`}
      onError={() => setImageError(true)}
    />
  );
}
