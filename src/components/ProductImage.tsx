'use client';

import { useState } from 'react';
import { Pip } from './Pip';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function ProductImage({ src, alt, className = '' }: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`flex flex-col items-center justify-center p-4 bg-cream-dark border-b-[3px] border-ink ${className}`}>
        <div className="w-16 h-16 sm:w-24 sm:h-24 mb-4 opacity-50">
          <Pip />
        </div>
        <p className="font-display text-ink font-semibold text-center text-sm sm:text-base leading-tight">
          {alt}
        </p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
}
