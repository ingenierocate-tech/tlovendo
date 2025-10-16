'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type Slide = {
  id: string;
  src: string;      // ej: '/Slider1.png' (desde /public)
  alt?: string;
  title?: string;
  desc?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

type Props = {
  slides: Slide[];
  intervalMs?: number; // autoplay
};

export default function HeroSliderImpl({ slides, intervalMs = 5000 }: Props) {
  const [mounted, setMounted] = useState(false);
  const [current, setCurrent] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // 1) Evita hydration mismatch
  useEffect(() => setMounted(true), []);

  // 2) Autoplay solo en cliente
  useEffect(() => {
    if (!mounted || slides.length <= 1 || !intervalMs) return;
    timer.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, intervalMs);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [mounted, slides.length, intervalMs]);

  // Proporción 16:9 en lugar de alturas fijas
  const heightClasses = 'aspect-[16/9]';

  if (!mounted) {
    return (
      <div className={`relative w-full overflow-hidden rounded-2xl ${heightClasses}`}>
        {slides[0] && (
          <Image
            src={slides[0].src}
            alt={slides[0].alt ?? ''}
            fill
            priority
            sizes="100vw"
            className="object-contain bg-black"
          />
        )}
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl ${heightClasses}`}>
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-500 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden={i !== current}
        >
          <Image
            src={s.src}
            alt={s.alt ?? ''}
            fill
            priority={i === current}
            sizes="100vw"
            className="object-contain bg-black"   // <- cambiado de object-cover
          />

          {/* Degradado para que el texto sea legible sobre cualquier foto */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-transparent" />

          {/* Texto + CTA (opcional) */}
          {(s.title || s.desc || s.ctaLabel) && (
            <div className="absolute inset-x-4 md:inset-x-8 bottom-8 md:bottom-12 text-white max-w-3xl">
              {s.title && (
                <h2 className="text-3xl md:text-5xl font-semibold leading-tight drop-shadow">
                  {s.title}
                </h2>
              )}
              {s.desc && (
                <p className="mt-3 text-base md:text-lg opacity-95 drop-shadow">
                  {s.desc}
                </p>
              )}
              {s.ctaLabel && s.ctaHref && (
                <a
                  href={s.ctaHref}
                  className="inline-block mt-5 rounded-full bg-white text-black px-5 py-2.5 text-sm md:text-base font-medium hover:bg-white/90 transition"
                >
                  {s.ctaLabel}
                </a>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((s, i) => (
          <button
            key={`dot-${s.id}`}
            aria-label={`Ir al slide ${i + 1}`}
            onClick={() => setCurrent(i)}
            className={`h-2.5 w-2.5 rounded-full ${i === current ? 'bg-white' : 'bg-white/50'}`}
          />
        ))}
      </div>

      {/* Flechas */}
      {slides.length > 1 && (
        <>
          <button
            aria-label="Anterior"
            onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 px-3 py-2 hover:bg-white"
          >
            ‹
          </button>
          <button
            aria-label="Siguiente"
            onClick={() => setCurrent((c) => (c + 1) % slides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 px-3 py-2 hover:bg-white"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}