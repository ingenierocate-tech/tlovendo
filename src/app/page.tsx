import { Suspense } from 'react';
import HomeClient from '@/components/home/HomeClient';
import { getVehicles } from '@/data/vehicles';
import type { Vehicle } from '@/types/vehicle';

export const dynamic = 'force-dynamic';
export const revalidate = false;

export default async function Home() {
  let vehicles: Vehicle[] = [];
  try {
    vehicles = await getVehicles();
    console.log(`🏠 Página principal: ${vehicles.length} vehículos cargados`);
  } catch (error) {
    console.error('🏠 Error cargando vehículos en página principal:', error);
    vehicles = [];
  }
  // Destacados explícitos por slug (en orden solicitado)
  const desiredFeaturedSlugs = [
    'chevrolet-silverado-zr2-2024',
    'bmw-x1-2019',
    'mercedes-benz-glc-2016-220d',
  ];

  const normalize = (s?: string) => (s || '').toLowerCase().trim();

  // Slugs que deben considerarse vendidos aunque el estado sea ambiguo
  const forcedSoldSlugs = new Set([
    'kia-morning-2024-full',
    'bmw-320i-m-sport-2024',
    'porsche-panamera-gts-2017',
    'kia-rio-5-2018',
  ]);

  const isSold = (v: Vehicle) =>
    normalize(v.state ?? v.status) === 'vendido' || forcedSoldSlugs.has(v.slug);

  const isForSale = (v: Vehicle) =>
    normalize(v.state ?? v.status) === 'en venta' && !isSold(v);

  // Filtrar explícitos: solo “en venta” y no vendidos
  let featured: Vehicle[] = desiredFeaturedSlugs
    .map((slug) => vehicles.find((v) => v.slug === slug))
    .filter((v): v is Vehicle => !!v && isForSale(v));

  // Fallback: completar hasta 3 con otros “en venta” (no vendidos)
  if (featured.length < 3) {
    const selected = new Set(featured.map((v) => v.slug));
    const extras = vehicles
      .filter((v) => isForSale(v) && !selected.has(v.slug))
      .slice(0, 3 - featured.length);
    featured = [...featured, ...extras];
  }

  return (
    <Suspense fallback={
      <main className="min-h-[60vh] grid place-items-center">
        <p className="text-neutral-500">Cargando…</p>
      </main>
    }>
      <HomeClient vehicles={featured} />
    </Suspense>
  );
}