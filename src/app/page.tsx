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
  const featured = vehicles.slice(0, 3);

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