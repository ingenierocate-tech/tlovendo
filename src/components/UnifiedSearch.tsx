'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useRef } from 'react';

const categories = [
  { name: 'Citycar',      slug: 'citycar',     image: '/citycar.png' },
  { name: 'Hatchback',    slug: 'hatchback',   image: '/hatchback.png' },
  { name: 'SUV',          slug: 'suv',         image: '/suv.png' },
  { name: 'Sedán',        slug: 'sedan',       image: '/sedan.png' },
  { name: 'Camionetas',   slug: 'camionetas',  image: '/camioneta.png' },
  { name: 'Utilitarios',  slug: 'utilitarios', image: '/utilitario.png' },
];

interface UnifiedSearchProps {
  variant?: 'default' | 'header' | 'compact';
  className?: string;
}

export default function UnifiedSearch({ variant = 'default', className }: UnifiedSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = inputRef.current?.value?.trim() ?? '';
    const url = q ? `/compra?query=${encodeURIComponent(q)}` : '/compra';
    router.push(url);
  };

  // Variantes header y compact: solo buscador
  if (variant === 'header' || variant === 'compact') {
    return (
      <div className={className}>
        <form onSubmit={onSubmit}>
          <div className="flex items-stretch gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar por marca o modelo..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 md:py-3 outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Buscar por marca o modelo"
            />
            <button
              type="submit"
              className="rounded-lg bg-red-600 px-4 md:px-5 py-2.5 md:py-3 text-white font-semibold hover:bg-red-700 transition-colors"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Variante default: categorías + buscador con fondo negro
  return (
    <div className="py-10">
      {/* Título */}
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-white">
        ¿Qué auto buscas?
      </h2>

      {/* Categorías */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/compra?categoria=${encodeURIComponent(c.slug)}`}
            className="group rounded-xl bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 p-6 flex flex-col items-center text-center hover:scale-105"
          >
            <div className="relative w-36 h-24 sm:w-40 sm:h-28">
              <Image
                src={c.image}
                alt={c.name}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 144px, (max-width: 1024px) 160px, 160px"
                priority={false}
              />
            </div>
            <span className="mt-4 font-medium text-base text-gray-800 group-hover:text-gray-900">
              {c.name}
            </span>
          </Link>
        ))}
      </div>

      {/* Buscador */}
      <form onSubmit={onSubmit} className="max-w-3xl mx-auto">
        <div className="flex items-stretch gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar por marca o modelo..."
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Buscar por marca o modelo"
          />
          <button
            type="submit"
            className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 transition-colors"
          >
            Buscar
          </button>
        </div>
      </form>
    </div>
  );
}