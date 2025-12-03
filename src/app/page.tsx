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
  const isForSale = (v: Vehicle) => normalize(v.state) === 'en venta';

  let featured: Vehicle[] = desiredFeaturedSlugs
    .map((slug) => vehicles.find((v) => v.slug === slug))
    .filter(Boolean) as Vehicle[];

  // Fallback: completar hasta 3 con otros “en venta” si falta alguno
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