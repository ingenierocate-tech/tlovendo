import Image, { ImageProps } from 'next/image';

type Props = ImageProps & { 
  fallbackSrc?: string;
};

export default function TLVImage({ 
  src, 
  alt, 
  width, 
  height, 
  placeholder = 'blur', 
  blurDataURL = '/blur-10x10.png', 
  fallbackSrc = '/placeholder-car.webp', 
  ...rest 
}: Props) {
  const safeAlt = alt || 'Imagen TLoVendo';
  
  return (
    <Image
      src={src || fallbackSrc!}
      alt={safeAlt}
      width={width || 600}
      height={height || 400}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      sizes="(max-width: 768px) 100vw, 50vw"
      {...rest}
    />
  );
}