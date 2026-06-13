/**
 * ImageWithFallback — Componente de imagen con fallback visual
 *
 * Muestra una imagen placeholder generada con SVG cuando la imagen original
 * no puede cargarse (src vacío, error de red, etc.)
 */

import { useState, type ImgHTMLAttributes } from 'react';
import { getZeldaImageUrl } from '@/utils/pokemonUtils';

interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  characterName: string;
  characterId: number;
}

export function ImageWithFallback({
  characterName,
  characterId,
  src,
  alt,
  className = '',
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [useFallback, setUseFallback] = useState(!src);

  const fallbackSrc = getZeldaImageUrl(characterName, characterId);

  if (useFallback || hasError) {
    return (
      <img
        src={fallbackSrc}
        alt={alt || characterName}
        className={className}
        onError={() => {
          // Si incluso el fallback falla, mostramos un placeholder SVG inline
          setHasError(true);
        }}
        {...props}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt || characterName}
      className={className}
      onError={() => {
        setHasError(true);
      }}
      {...props}
    />
  );
}
