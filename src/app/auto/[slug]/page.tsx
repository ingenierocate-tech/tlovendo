import TLVImage from '@/components/TLVImage';
import VehicleGallery from '@/components/VehicleGallery';
import RelatedVehicles from '@/components/RelatedVehicles';
import VehicleInfo from '@/components/VehicleInfo';
import VehicleSpecs from '@/components/VehicleSpecs';
import VehicleContactButtonsWrapper from '@/components/VehicleContactButtonsWrapper';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { getVehicleBySlug, getVehicles } from '@/data/vehicles';

interface RelatedItem {
  id: number;
  slug: string;
  title: string;
  image: string;
  price: number | null;
}

import type { Vehicle } from '@/types/vehicle';

export default async function Auto({ params }: { params: { slug: string } }) {
  const vehicle = await getVehicleBySlug(params.slug);
  
  if (!vehicle) {
    notFound();
  }

  // Obtener vehículos relacionados (excluyendo el actual y SOLO "en venta", prioriza marca/año)
  const allVehicles = await getVehicles();

  const normalize = (s?: string) => (s ?? '').toLowerCase().trim();

  // Slugs forzados a estado "vendido" para evitar que se cuelen
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

  const score = (v: Vehicle) => {
    let s = 0;
    if (normalize(v.brand) === normalize(vehicle.brand)) s += 2; // misma marca
    if (v.year != null && vehicle.year != null && v.year === vehicle.year) s += 1; // mismo año
    return s;
  };

  const candidates = (allVehicles ?? [])
    .filter(v => v.id !== vehicle.id)
    .filter(v => v.brand && v.model && v.year != null)
    .filter(isForSale);

  const ordered = candidates.sort((a, b) => score(b) - score(a));

  const relatedItems: RelatedItem[] = ordered
    .slice(0, 6)
    .map(v => ({
      id: v.id,
      slug: v.slug,
      title: `${v.brand || 'Marca'} ${v.model || 'Modelo'} ${v.year || 'Año'}`,
      image: v.image ?? '/placeholder-car.webp',
      price: v.price ?? null,
    }));
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price)
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
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
                  Comprar
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                <span className="ml-1 text-gray-500 md:ml-2">{vehicle.brand} {vehicle.model} {vehicle.year}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Título principal */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {vehicle.brand} {vehicle.model} {vehicle.version ? `${vehicle.version} ` : ''}{vehicle.year}
          </h1>
        </div>

        {/* Layout principal: 2 columnas en desktop */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Galería - 2 columnas del grid (más grande) */}
            <div className="lg:col-span-2">
              <VehicleGallery 
                images={Array.isArray(vehicle.images) ? vehicle.images : []} 
                title={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
                compact={false}
              />
            </div>

            {/* Información del vehículo - 1 columna del grid (más pequeña) */}
            <div className="p-6 space-y-4">
              {/* Precio */}
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {isForSale(vehicle) ? (
                    typeof vehicle.price === 'number'
                      ? formatPrice(vehicle.price)
                      : <span className="text-gray-700">Consultar precio</span>
                  ) : (
                    <span className="text-red-600">Vendido</span>
                  )}
                </div>
                {/* Mostrar la leyenda verde siempre que esté "En venta" */}
                {isForSale(vehicle) && (
                  <div className="text-sm text-green-600 font-medium flex items-center justify-center lg:justify-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Precio final sin cargos ocultos
                  </div>
                )}
              </div>

              {/* Información básica */}
              <div className="space-y-2">
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Año:</span>
                  <span className="font-semibold text-sm">{vehicle.year}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Kilómetros:</span>
                  <span className="font-semibold text-sm">{vehicle.kilometers?.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Transmisión:</span>
                  <span className="font-semibold text-sm">{vehicle.transmission}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Combustible:</span>
                  <span className="font-semibold text-sm">{vehicle.fuel}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Región:</span>
                  <span className="font-semibold text-sm">{vehicle.region}</span>
                </div>
              </div>

              {/* Trust badge */}
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <div className="font-medium text-blue-900 text-sm">Autofact incluido</div>
                    <div className="text-xs text-blue-700">Historial verificado</div>
                  </div>
                </div>
              </div>

              {/* Botón de contacto */}
              <div className="pt-3">
                <VehicleContactButtonsWrapper vehicle={vehicle} />
              </div>
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
          <p className="text-gray-600 leading-relaxed">
            Excelente estado, mantenciones al día, único dueño.
          </p>
        </div>

        {/* Especificaciones técnicas detalladas */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <VehicleSpecs vehicle={vehicle} />
        </div>
        
        {/* Vehículos relacionados */}
        <div className="mt-12">
          <RelatedVehicles items={relatedItems} title="Vehículos similares" />
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-static';
export const dynamicParams = false;

import { getLocalSlugs } from '@/data/local';

export async function generateStaticParams() {
  const slugs = await getLocalSlugs();
  return slugs.map((slug) => ({ slug }));
}