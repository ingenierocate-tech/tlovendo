'use client';

import dynamic from 'next/dynamic';
import TLVImage from '@/components/TLVImage';
import Link from 'next/link';
import UnifiedSearch from '@/components/UnifiedSearch';

// HeroSlider con alias @/ y fallback mejorado
const HeroSlider = dynamic(() => import('@/components/HeroSliderImpl'), {
  ssr: false,
  loading: () => <div className="h-[360px] w-full bg-gray-100" />
});

const slides = [
  { id: 's1', src: '/Slider1.png', alt: 'Llaves', title: 'Compra con confianza', desc: 'Gestión completa y segura', ctaLabel: 'Ver catálogo', ctaHref: '/compra' },
  { id: 's2', src: '/Slider2.png', alt: 'Velocidad', title: 'Financiamiento a tu medida', desc: 'Créditos con tasas competitivas', ctaLabel: 'Simular crédito', ctaHref: '/financiamiento' },
  { id: 's3', src: '/Slider3.png', alt: 'Entrega', title: 'Vende tu auto fácil y rápido', desc: 'Publicación, visitas y cierre seguro', ctaLabel: 'Vender auto', ctaHref: '/vender' },
];

const categories = [
  { name: 'Citycar', slug: 'citycar', image: '/citycar.png' },
  { name: 'Hatchback', slug: 'hatchback', image: '/hatchback.png' },
  { name: 'SUV', slug: 'suv', image: '/suv.png' },
  { name: 'Sedán', slug: 'sedan', image: '/sedan.png' },
  { name: 'Camionetas', slug: 'camionetas', image: '/camioneta.png' },
  { name: 'Utilitarios', slug: 'utilitarios', image: '/utilitario.png' },
];

export default function HomeClientSection() {
  return (
    <>
      {/* Slider full-bleed - comienza inmediatamente después del header */}
      <section className="relative w-screen mx-[-calc(50vw-50%)] mt-0">
        <HeroSlider slides={slides} />
      </section>

      {/* Franja blanca con categorías y barra de búsqueda */}
      <section className="bg-white">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8">
          {/* Título */}
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-900">
            ¿Qué auto buscas?
          </h2>

          {/* Categorías de autos */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/compra?categoria=${category.slug}`}
                className="group flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-md transition-all duration-200"
              >
                <div className="w-16 h-16 mb-3 flex items-center justify-center">
                  <TLVImage
                    src={category.image}
                    alt={category.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Barra de búsqueda compacta */}
          <div className="max-w-2xl mx-auto">
            <UnifiedSearch variant="compact" />
          </div>
        </div>
      </section>
    </>
  );
}