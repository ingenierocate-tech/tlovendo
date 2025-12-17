import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { getVehicles } from '@/data/vehicles';
import VehicleCard from '@/components/VehicleCard';
import { CATEGORIES, getVehicleCategory } from '@/lib/categoryUtils';
import { Vehicle } from '@/types/vehicle';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = CATEGORIES.find(c => c.slug === params.slug);

  if (!category) {
    notFound();
  }

  const allVehicles = await getVehicles();

  const normalize = (s?: string) => (s ?? '').toLowerCase().trim();

  // Slugs forzados a estado "vendido"
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

  const vehicles = allVehicles
    .filter(isForSale)
    .filter(v => getVehicleCategory(v) === category.slug);

  // Calcular otras categorías activas si no hay vehículos en la actual
  let otherActiveCategories: typeof CATEGORIES = [];
  if (vehicles.length === 0) {
    otherActiveCategories = CATEGORIES.filter(c => 
      c.slug !== category.slug && 
      allVehicles.some(v => isForSale(v) && getVehicleCategory(v) === c.slug)
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-gray-700 hover:text-gray-900">
                Inicio
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                <Link href="/compra" className="text-gray-700 hover:text-gray-900 ml-1 md:ml-2">
                  Compra
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                <span className="ml-1 text-gray-500 md:ml-2 capitalize">{category.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
          <p className="mt-2 text-gray-600">
            Explora nuestra selección de {category.name} disponibles.
          </p>
        </div>

        {/* Grid */}
        {vehicles.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.slug} vehicle={vehicle} />
              ))}
            </div>

            <div className="flex justify-center">
              <Link 
                href="/compra" 
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-black hover:bg-neutral-800 transition-colors"
              >
                Ver todos los autos disponibles
              </Link>
            </div>
          </>
        ) : (
          <div className="py-12">
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-900/5 max-w-3xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Por ahora no tenemos autos disponibles en esta categoría.
              </h3>
              <p className="text-gray-600 mb-10 text-lg">
                Te invitamos a explorar otras opciones, ¡hay más vehículos esperando por ti!
              </p>
              
              {otherActiveCategories.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
                  {otherActiveCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/compra/categoria/${cat.slug}`}
                      className="flex flex-col items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-4 text-center hover:bg-neutral-50 transition-colors"
                    >
                      <Image
                        src={cat.icon}
                        alt={cat.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-contain"
                      />
                      <span className="text-sm font-medium text-neutral-900">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              )}

              <Link 
                href="/compra" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-black hover:bg-neutral-800 transition-colors"
              >
                Ver todos los autos disponibles
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}