'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
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
    'kia-morning-2024-full', // ← forzado a "Vendidos"
  ]);

  // Excluir de 'vendidos' por foto incorrecta
  const excludeSoldSlugs = new Set(['kia-soluto-2024-lx']);

  const isSold = (v: any) => {
    const slug = String(v.slug ?? v.id ?? '');
    return normalizeState(v) === 'vendido' || forcedSoldSlugs.has(slug);
  };

  const [sortBy, setSortBy] = useState<'recent' | 'priceDesc' | 'priceAsc' | 'kmAsc' | 'kmDesc'>('recent');

  const getYear = (v: any) => Number(v.year ?? 0);
  const getPrice = (v: any) => Number(v.finalPrice ?? v.price ?? 0);
  const getKm = (v: any) => Number(v.kilometers ?? v.km ?? 0);

  const sold = vehicles.filter((v) => {
    const slug = String(v.slug ?? v.id ?? '');
    return isSold(v) && !excludeSoldSlugs.has(slug);
  });
  const available = vehicles.filter((v) => !isSold(v));

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

  // Orden explícito para sección "Vendidos": BMW primero, Porsche segundo
  const soldPriorityOrder = ['bmw-320i-m-sport-2024', 'porsche-panamera-gts-2017'];
  const soldPrioritySet = new Set(soldPriorityOrder);
  const soldOrdered = [
    ...sold
      .filter((v) => soldPrioritySet.has(String(v.slug ?? v.id ?? '')))
      .sort(
        (a, b) =>
          soldPriorityOrder.indexOf(String(a.slug ?? a.id ?? '')) -
          soldPriorityOrder.indexOf(String(b.slug ?? b.id ?? ''))
      ),
    ...sold.filter((v) => !soldPrioritySet.has(String(v.slug ?? v.id ?? ''))),
  ];

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
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </section>

      {soldOrdered.length > 0 && (
        <section className="mt-24 mb-32">
          <h3 className="text-2xl font-bold mb-4">Autos vendidos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
            {soldOrdered.map((vehicle) => (
              <SoldVehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}