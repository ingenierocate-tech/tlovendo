"use client";
import TLVImage from '@/components/TLVImage';

interface VehicleCardImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export default function VehicleCardImage({ src, alt, className, priority }: VehicleCardImageProps) {
  // Fallback seguro a placeholder si no hay src válida
  const imageSrc = src || '/placeholder-car.webp';
  
  return (
    <TLVImage
      src={imageSrc}
      alt={alt}
      width={400}
      height={300}
      className={className}
      priority={priority}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
    />
  );
}