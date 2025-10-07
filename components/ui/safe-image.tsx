// components/ui/safe-image.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

interface SafeImageProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: React.ReactNode;
}

export function SafeImage({
  src,
  alt,
  width = 48,
  height = 48,
  className = "",
  fallback = <span className="text-lg">📚</span>,
}: SafeImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return <div className={className}>{fallback}</div>;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
    />
  );
}
