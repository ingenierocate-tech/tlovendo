import Image, { ImageProps } from 'next/image';

type Props = ImageProps & { 
  fallbackSrc?: string;
};

export default function TLVImage({ 
  src, 
  alt, 
  width, 
  height, 
  fill,
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
      {...(fill ? {} : { width: width || 600, height: height || 400 })}
      {...(fill ? { fill } : {})}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      sizes={fill 
        ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
        : '(max-width: 768px) 100vw, 50vw'}
      {...rest}
    />
  );
}