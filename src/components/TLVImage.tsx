import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';

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
    const encodedSrc = typeof src === 'string' ? encodeURI(src) : src;
    const initialSrc = (encodedSrc || fallbackSrc) as any;
    const [srcToUse, setSrcToUse] = useState(initialSrc);

    // Actualizar srcToUse cuando cambia la prop src
    useEffect(() => {
      const encoded = typeof src === 'string' ? encodeURI(src) : src;
      setSrcToUse(encoded || fallbackSrc);
    }, [src, fallbackSrc]);

    return (
      <Image
        src={srcToUse}
        alt={safeAlt}
        {...(fill ? {} : { width: width || 600, height: height || 400 })}
        {...(fill ? { fill } : {})}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        sizes={fill 
          ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          : '(max-width: 768px) 100vw, 50vw'}
        unoptimized={typeof srcToUse === 'string' && srcToUse.startsWith('/')}
        onError={() => setSrcToUse(fallbackSrc as any)}
        {...rest}
      />
    );
}