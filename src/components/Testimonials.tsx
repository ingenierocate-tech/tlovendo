'use client';

import { useRef } from 'react';

type Testimonial = {
  name: string;
  role?: string;
  quote: string;
  rating?: number; // 0–5
  avatarUrl?: string;
};

const data: Testimonial[] = [
  {
    name: 'María López',
    role: 'Vendedora particular',
    quote:
      'Publicaron mi auto, coordinaron las visitas y en menos de una semana estaba vendido. Súper transparente todo.',
    rating: 5,
  },
  {
    name: 'Javier Torres',
    role: 'Comprador',
    quote:
      'Vi el catálogo, pedí más info por WhatsApp y cerramos rápido. La transferencia fue segura y sin letras chicas.',
    rating: 5,
  },
  {
    name: 'Camila Rivas',
    role: 'Financiamiento',
    quote:
      'Me ayudaron a simular y conseguir un crédito a buena tasa. El proceso fue claro y acompañado.',
    rating: 4,
  },
];

function Stars({ value = 5 }: { value?: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${value} de 5 estrellas`}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`h-5 w-5 ${i < value ? 'fill-yellow-400' : 'fill-gray-300'}`}
          aria-hidden="true"
        >
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBySlide = (dir: 'prev' | 'next') => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-slide]');
    const delta = (card?.offsetWidth ?? el.clientWidth * 0.8) + 16;
    el.scrollBy({ left: dir === 'next' ? delta : -delta, behavior: 'smooth' });
  };

  return (
    <section aria-labelledby="testimonials-title" className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 id="testimonials-title" className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Lo que dicen nuestros clientes
          </h2>
          <p className="mt-3 text-gray-600">
            Experiencias reales de compra, venta y financiamiento.
          </p>
        </div>

        <div className="relative mt-10">
          {/* Overlay Navigation Controls - Mobile Only */}
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex justify-between lg:hidden">
            <button
              type="button"
              aria-label="Anterior"
              onClick={() => scrollBySlide('prev')}
              className="pointer-events-auto my-auto ml-[-4px] rounded-full bg-white/90 shadow p-2 ring-1 ring-gray-200 hover:bg-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-gray-700">
                <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Siguiente"
              onClick={() => scrollBySlide('next')}
              className="pointer-events-auto my-auto mr-[-4px] rounded-full bg-white/90 shadow p-2 ring-1 ring-gray-200 hover:bg-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-gray-700">
                <path d="m10 6 1.41 1.41L7.83 11H20v2H7.83l3.58 3.59L10 18l-6-6z" />
              </svg>
            </button>
          </div>

          {/* Responsive Testimonials Container */}
          <div
            ref={trackRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-1 
              [-ms-overflow-style:none] [scrollbar-width:none] 
              lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:snap-none lg:px-0"
          >
            <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>

            {data.map((t, idx) => (
              <figure
                key={idx}
                data-slide
                className="snap-start shrink-0 w-[85%] sm:w-[70%] md:w-[55%] 
                  rounded-2xl border border-gray-200 shadow-sm p-6 bg-white 
                  lg:w-auto lg:snap-none"
              >
                <blockquote>
                  <p className="text-gray-800 leading-relaxed">"{t.quote}"</p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gray-100 grid place-items-center text-gray-600 font-semibold">
                    {t.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{t.name}</div>
                    {t.role && <div className="text-sm text-gray-500">{t.role}</div>}
                    {typeof t.rating === 'number' && (
                      <div className="mt-1">
                        <Stars value={t.rating} />
                      </div>
                    )}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Pagination Dots - Mobile Only */}
          <div className="mt-6 flex justify-center gap-2 lg:hidden">
            {data.map((_, i) => (
              <span key={i} className="h-2 w-2 rounded-full bg-gray-300 inline-block" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}