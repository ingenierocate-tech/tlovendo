"use client";
interface VehicleCardImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export default function VehicleCardImage({ src, alt, className, priority }: VehicleCardImageProps) {
  const imageSrc = src || '/placeholder-car.webp';
  const encoded = typeof imageSrc === 'string' ? encodeURI(imageSrc) : imageSrc;
  return (
    <img
      src={encoded as any}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      onError={(e) => { e.currentTarget.src = '/placeholder-car.webp'; }}
    />
  );
}