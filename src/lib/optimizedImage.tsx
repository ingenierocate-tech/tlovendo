import React from 'react';
import manifest from '../../assets/optimized/manifest.json';

interface ImageData {
  sizes: number[];
  avif: string[];
  webp: string[];
  jpeg: string[];
  reduction_pct: number;
}

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function getOptimizedImageData(src: string): ImageData | null {
  const key = src.replace(/^\//, '');
  return (manifest as Record<string, ImageData>)[key] || null;
}

export function generateSrcSet(images: string[], basePath = '/assets/optimized/'): string {
  return images
    .map((img, index) => `${basePath}${img} ${[400, 800, 1200][index] || 1200}w`)
    .join(', ');
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className, 
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false 
}: OptimizedImageProps) {
  const imageData = getOptimizedImageData(src);
  
  if (!imageData) {
    return (
      <img 
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
      />
    );
  }

  const avifSrcSet = generateSrcSet(imageData.avif);
  const webpSrcSet = generateSrcSet(imageData.webp);
  const jpegSrcSet = generateSrcSet(imageData.jpeg);
  
  return (
    <picture>
      <source srcSet={avifSrcSet} sizes={sizes} type="image/avif" />
      <source srcSet={webpSrcSet} sizes={sizes} type="image/webp" />
      <img 
        srcSet={jpegSrcSet}
        sizes={sizes}
        src={`/assets/optimized/${imageData.jpeg[0]}`}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
      />
    </picture>
  );
}