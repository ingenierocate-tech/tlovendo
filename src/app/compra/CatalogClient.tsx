'use client';

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
  ]);

  // Excluir de 'vendidos' por foto incorrecta
  const excludeSoldSlugs = new Set(['kia-soluto-2024-lx']);

  const isSold = (v: any) => {
    const slug = String(v.slug ?? v.id ?? '');
    return normalizeState(v) === 'vendido' || forcedSoldSlugs.has(slug);
  };

  // Único cálculo de listas
  const sold = vehicles.filter((v) => {
    const slug = String(v.slug ?? v.id ?? '');
    return isSold(v) && !excludeSoldSlugs.has(slug);
  });
  const available = vehicles.filter((v) => !isSold(v));

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
        <header className="mb-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">
            Catálogo de Autos
          </h2>
          <p className="mt-2 text-neutral-600">
            Mostrando {available.length} vehículos
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
          {available.map((vehicle) => (
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