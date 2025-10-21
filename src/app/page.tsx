import { Suspense } from 'react';
import HomeClient from '@/components/home/HomeClient';
import { getVehicles } from '@/data/vehicles';
import type { Vehicle } from '@/types/vehicle';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let vehicles: Vehicle[] = [];
  try {
    vehicles = await getVehicles();
    console.log(`🏠 Página principal: ${vehicles.length} vehículos cargados`);
  } catch (error) {
    console.error('🏠 Error cargando vehículos en página principal:', error);
    vehicles = [];
  }
  
  // Slugs de vehículos destacados específicos (excluyendo vendidos)
  const featuredSlugs = [
    'mercedes-benz-glc-2016-220d',
    'nissan-pathfinder-2018-full',
    'hyundai-tucson-2018-full',
  ];
  
  // Filtrar vehículos destacados específicos
  const featuredVehicles = vehicles.filter(v => featuredSlugs.includes(v.slug));
  
  // Si no encontramos los específicos, usar otros vehículos disponibles (excluyendo vendidos)
  const soldSlugs = ['kia-sonet-2024-full', 'suzuki-alto-2022-800'];
  const fallbackVehicles = vehicles.filter(v => !soldSlugs.includes(v.slug));
  
  const featured = featuredVehicles.length >= 3 ? featuredVehicles.slice(0, 3) : fallbackVehicles.slice(0, 3);

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