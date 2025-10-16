"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPinIcon, CogIcon, FireIcon } from "@heroicons/react/24/outline";
import VehicleCardImage from "@/components/VehicleCardImage";
import type { Vehicle } from '@/types/vehicle';
import { getVehiclePrimaryImage, getVehicleImageAlt } from '@/lib/vehicleImage';

interface VehicleCardProps {
  vehicle: Vehicle;
  variant?: 'catalog' | 'home';
}

// Formateador seguro para precios en CLP
const fmtCLP = (n: number | null | undefined) => {
  if (n === null || n === undefined) return "Consultar";
  try {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return "Consultar";
  }
};

// Formateador seguro para kilómetros
const fmtKM = (km: number | string | null | undefined) => {
  if (km === null || km === undefined || km === '') return "No disponible";
  
  if (typeof km === 'string') {
    if (km === 'No disponible') return km;
    const parsed = parseFloat(km.replace(/[^\d.-]/g, ''));
    if (isNaN(parsed)) return km;
    km = parsed;
  }
  
  if (typeof km === 'number') {
    return `${km.toLocaleString('es-CL')} km`;
  }
  
  return "No disponible";
};

// Construir href para detalles del vehículo
function buildDetailsHref(v: Vehicle) {
  return `/auto/${v.slug}`;
}

export default function VehicleCard({ vehicle, variant = 'catalog' }: VehicleCardProps) {
  // Fallbacks robustos para todos los campos
  const title = `${vehicle.brand || 'Marca'} ${vehicle.model || 'Modelo'} ${vehicle.year || 'Año'}`;
  const price = fmtCLP(vehicle.price);
  const transmission = vehicle.transmission || 'No disponible';
  const fuel = vehicle.fuel || 'No disponible';
  const region = vehicle.region || 'No disponible';
  const kilometers = fmtKM(vehicle.kilometers);
  const href = buildDetailsHref(vehicle);

  // Usar función segura para obtener imagen principal
  const imageUrl = getVehiclePrimaryImage(vehicle, '/placeholder-car.webp');
  const imageAlt = getVehicleImageAlt(vehicle);

  if (variant === 'home') {
    return (
      <Link href={href} className="block h-full">
        <div className="rounded-2xl overflow-hidden border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
          {/* Imagen 16:9 */}
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
          
          {/* Contenido */}
          <div className="p-5 sm:p-6 flex flex-col flex-grow">
            {/* Título */}
            <h3 className="text-xl sm:text-2xl font-semibold text-neutral-900">
              {title}
            </h3>
            
            {/* Precio */}
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-black">
              {price}
            </p>
            
            {/* Frase verde */}
            <p className="mt-1 text-sm font-medium text-green-600">
              Precio final sin cargos ocultos
            </p>
            
            {/* Badges */}
            <div className="mt-4 flex flex-wrap gap-2 flex-grow">
              <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700">
                {transmission}
              </span>
              <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700">
                {fuel}
              </span>
              <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700">
                {kilometers}
              </span>
              <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700">
                {region}
              </span>
            </div>
            
            {/* CTA */}
            <button className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 font-semibold text-white shadow-lg hover:from-red-700 hover:to-red-800 hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
              <span>Ver detalles</span>
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </Link>
    );
  }

  // Variant 'catalog' (estilo original)
  return (
    <div className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-w-16 aspect-h-9 bg-gray-200 overflow-hidden">
        <VehicleCardImage
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>
        
        <div className="mb-3">
          <p className="text-2xl font-bold text-black">
            {price}
          </p>
          <p className="text-sm font-medium text-green-600">
            Precio final sin cargos ocultos
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
            <CogIcon className="h-3 w-3" />
            {transmission}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
            <FireIcon className="h-3 w-3" />
            {fuel}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
            {kilometers}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
            <MapPinIcon className="h-3 w-3" />
            {region}
          </span>
        </div>

        <Link
          href={href}
          className="block w-full rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg hover:from-red-700 hover:to-red-800 hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <span className="inline-flex items-center">
            Ver detalles
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
}