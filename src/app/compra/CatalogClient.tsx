'use client';

import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import SoldVehicleCard from '@/components/SoldVehicleCard';
import VehicleCard from '@/components/VehicleCard';
import type { Vehicle } from '@/types/vehicle';

type CatalogClientProps = {
  vehicles: Vehicle[];
};

export default function CatalogClient({ vehicles }: CatalogClientProps) {
  const normalizeState = (v: any) => {
    const s = (v.state ?? v.status ?? '').trim().toLowerCase();
    if (s.includes('vendido')) return 'vendido';
    if (s.includes('en venta')) return 'en venta';
    return '';
  };

  const forcedSoldSlugs = new Set([
    'bmw-320i-m-sport-2024',
    'porsche-panamera-gts-2017',
    'kia-rio-5-2018',
    'kia-morning-2024-full',
    'ford-f150-xlt-2016-full',
    'toyota-avensis-2013',
  ]);

  // Excluir de 'vendidos' por foto incorrecta
  const excludeSoldSlugs = new Set(['kia-soluto-2024-lx']);

  const getSlug = (v: any) => String(v.slug ?? v.id ?? '');

  const isSold = (v: any) => {
    const slug = getSlug(v);
    return normalizeState(v) === 'vendido' || forcedSoldSlugs.has(slug);
  };

  const isForSaleStrict = (v: any) => normalizeState(v) === 'en venta' && !isSold(v);

  const uniqueBySlug = <T extends any>(arr: T[]) => {
    const seen = new Set<string>();
    return arr.filter((v: any) => {
      const slug = getSlug(v);
      if (!slug) return true;
      if (seen.has(slug)) return false;
      seen.add(slug);
      return true;
    });
  };

  const [sortBy, setSortBy] = useState<'recent' | 'priceDesc' | 'priceAsc' | 'kmAsc' | 'kmDesc'>('recent');

  const getYear = (v: any) => Number(v.year ?? 0);
  const getPrice = (v: any) => Number(v.finalPrice ?? v.price ?? 0);
  const getKm = (v: any) => Number(v.kilometers ?? v.km ?? 0);

  const premiumBrandOrder = [
    'porsche',
    'bmw',
    'mercedes-benz',
    'mercedes',
    'audi',
    'lexus',
    'land rover',
    'range rover',
    'volvo',
  ];

  const getBrandRank = (v: any) => {
    const brand = String(v.brand ?? '')
      .trim()
      .toLowerCase();
    const idx = premiumBrandOrder.findIndex((b) => brand === b || brand.startsWith(`${b} `) || brand.includes(b));
    return idx === -1 ? premiumBrandOrder.length + 1 : idx;
  };

  const available = uniqueBySlug(vehicles.filter((v) => isForSaleStrict(v)));
  const sold = uniqueBySlug(
    vehicles.filter((v) => {
      const slug = getSlug(v);
      return !isForSaleStrict(v) && !excludeSoldSlugs.has(slug);
    })
  );

  const availableSorted = useMemo(() => {
    const arr = [...available];
    switch (sortBy) {
      case 'recent':
        return arr.sort((a, b) => getYear(b) - getYear(a));
      case 'priceDesc':
        return arr.sort((a, b) => getPrice(b) - getPrice(a));
      case 'priceAsc':
        return arr.sort((a, b) => getPrice(a) - getPrice(b));
      case 'kmAsc':
        return arr.sort((a, b) => getKm(a) - getKm(b));
      case 'kmDesc':
        return arr.sort((a, b) => getKm(b) - getKm(a));
      default:
        return arr;
    }
  }, [available, sortBy]);

  // Fallback: si por alguna razón no se detectan vendidos, usar slugs forzados
  const forcedFallback = Array.from(forcedSoldSlugs)
    .map((slug) => vehicles.find((v) => String(v.slug ?? v.id ?? '') === slug))
    .filter((v): v is Vehicle => Boolean(v));
  const soldFinal = sold.length > 0 ? sold : forcedFallback;

  const soldScrollRef = useRef<HTMLDivElement | null>(null);

  const soldSorted = useMemo(() => {
    const arr = [...soldFinal];
    return arr.sort((a, b) => {
      const aRank = getBrandRank(a);
      const bRank = getBrandRank(b);
      const aIsPremium = aRank <= premiumBrandOrder.length;
      const bIsPremium = bRank <= premiumBrandOrder.length;

      if (aIsPremium !== bIsPremium) return aIsPremium ? -1 : 1;
      if (aRank !== bRank) return aRank - bRank;

      const byPrice = getPrice(b) - getPrice(a);
      if (byPrice !== 0) return byPrice;

      return getYear(b) - getYear(a);
    });
  }, [soldFinal]);

  const scrollSold = (dir: 'left' | 'right') => {
    const el = soldScrollRef.current;
    if (!el) return;
    const delta = Math.max(280, Math.floor(el.clientWidth * 0.85));
    el.scrollBy({ left: dir === 'left' ? -delta : delta, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-24 pb-48">
      <section>
        {/* Breadcrumb */}
        <div className="my-8 sm:my-10 lg:my-12">
          <div className="border-t border-neutral-200"></div>
          <nav className="py-3 sm:py-4 text-sm sm:text-base text-neutral-600">
            <Link href="/" className="hover:text-neutral-800">Inicio</Link>
            <span className="mx-2 text-neutral-400">/</span>
            <span className="font-medium text-neutral-800">Comprar</span>
          </nav>
          <div className="border-t border-neutral-200"></div>
        </div>

        {/* Título y filtro de orden */}
        <div className="mb-8 sm:mb-10 flex items-center justify-between gap-4">
          <header>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">
              Catálogo de Autos
            </h2>
            <p className="mt-3 text-neutral-600">
              Mostrando {availableSorted.length} vehículos
            </p>
          </header>

          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500">Ordenar por</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="recent">Más Recientes</option>
              <option value="priceDesc">Mayor Precio</option>
              <option value="priceAsc">Menor Precio</option>
              <option value="kmAsc">Menos KM</option>
              <option value="kmDesc">Más KM</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
          {availableSorted.map((vehicle) => (
            <VehicleCard key={vehicle.slug || String(vehicle.id)} vehicle={vehicle} />
          ))}
        </div>
      </section>

      {soldSorted.length > 0 && (
        <section className="mt-24 mb-32">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-2xl font-bold">Autos vendidos</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollSold('left')}
                className="rounded-full border border-red-700 bg-red-600 px-4 py-3 text-base font-semibold text-white shadow-md hover:bg-red-700 active:bg-red-800"
                aria-label="Ver vendidos anteriores"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => scrollSold('right')}
                className="rounded-full border border-red-700 bg-red-600 px-4 py-3 text-base font-semibold text-white shadow-md hover:bg-red-700 active:bg-red-800"
                aria-label="Ver vendidos siguientes"
              >
                →
              </button>
            </div>
          </div>

          <div
            ref={soldScrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {soldSorted.map((vehicle) => (
              <div key={vehicle.slug || String(vehicle.id)} className="w-72 shrink-0">
                <SoldVehicleCard vehicle={vehicle} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}