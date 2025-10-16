'use client';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

type RelatedItem = {
  id: number;
  slug: string;
  title: string;
  image?: string;
  price?: number | null;
};

interface RelatedVehiclesProps {
  items: RelatedItem[];
  title?: string;
}

const fmtCLP = (n?: number | null) => {
  if (n === null || n === undefined) return 'Consultar';
  try {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(n);
  } catch { return 'Consultar'; }
};

export default function RelatedVehicles({ items, title = 'Te puede interesar' }: RelatedVehiclesProps) {
  const [index, setIndex] = useState(0);
  const next = () => setIndex((i) => Math.min(i + 1, Math.max(0, items.length - 1)));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  if (!items?.length) return null;

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          <button aria-label="Anterior" onClick={prev} className="rounded border p-2 hover:bg-gray-50">
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button aria-label="Siguiente" onClick={next} className="rounded border p-2 hover:bg-gray-50">
            <ChevronRightIcon className="h-5 w-5" />
          </button>
          <Link href="/compra" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-md hover:from-red-700 hover:to-red-800 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            <span>Ver todos</span>
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.slice(index, index + 3).map((item) => (
          <article key={item.id} className="overflow-hidden rounded-xl border">
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image} alt={item.title} className="h-44 w-full object-cover" />
            ) : (
              <div className="h-44 w-full bg-gray-100" />
            )}
            <div className="p-4">
              <h3 className="line-clamp-1 text-base font-medium">{item.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{fmtCLP(item.price)}</p>
              <Link href={`/auto/${item.slug}`} className="mt-3 inline-flex items-center text-sm font-medium text-red-600 hover:text-red-800 transition-colors duration-200">
                <span>Ver detalle</span>
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}