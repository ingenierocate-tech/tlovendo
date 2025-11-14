import type { Vehicle } from '@/types/vehicle';

type Props = {
  vehicle: Vehicle;
  details?: string[];
};

import { Cog, Fuel, MapPin, Gauge } from 'lucide-react';
import Image from 'next/image';
import { getVehiclePrimaryImage, getVehicleImageAlt } from '@/lib/vehicleImage';

export default function SoldVehicleCard({ vehicle }: Props) {
    const title = `${vehicle.brand} ${vehicle.model} ${vehicle.year}`;
    const imageUrl = getVehiclePrimaryImage(vehicle, '/placeholder-car.webp');
    const imageAlt = getVehicleImageAlt(vehicle);
    const { transmission, fuel, kilometers, region } = vehicle;

    return (
      <div className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative isolate aspect-[16/9] bg-gray-200 overflow-hidden">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover z-0 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
          />
          <div className="absolute top-2 left-2 z-10 pointer-events-none bg-red-600 text-white text-xs sm:text-sm font-bold uppercase tracking-wide px-3 py-1 rounded-md shadow-sm w-fit">
            Vendido
          </div>
        </div>
        {/* contenido de la card */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>

          <div className="mb-3">
            <p className="text-2xl font-bold text-red-600">Vendido</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {transmission && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                <Cog className="h-3 w-3" />
                {transmission}
              </span>
            )}
            {fuel && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                <Fuel className="h-3 w-3" />
                {fuel}
              </span>
            )}
            {typeof kilometers === 'number' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                <Gauge className="h-3 w-3" />
                {new Intl.NumberFormat('es-CL').format(kilometers)} km
              </span>
            )}
            {region && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                <MapPin className="h-3 w-3" />
                {region}
              </span>
            )}
          </div>

          {/* Se eliminó la sección de características principales */}
        </div>
      </div>
    );
}