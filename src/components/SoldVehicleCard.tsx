import type { Vehicle } from '@/types/vehicle';

interface Props {
  vehicle: Vehicle;
}

export default function SoldVehicleCard({ vehicle }: Props) {
  const { image, brand, model, year } = vehicle;

  return (
    <div className="border rounded-2xl overflow-hidden shadow hover:shadow-md transition-shadow duration-200">
      <div className="relative overflow-hidden h-48 sm:h-52 md:h-56">
        <img
          src={(image ? encodeURI(image) : '/placeholder-car.webp') as any}
          alt={`Foto ${brand} ${model}`}
          className="object-cover w-full h-full"
          onError={(e) => { e.currentTarget.src = '/placeholder-car.webp'; }}
        />
        <div className="absolute top-2 left-2 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded">
          VENDIDO
        </div>
      </div>
      <div className="p-3">
        <div className="font-medium text-sm">
          {brand} {model} {year}
        </div>
      </div>
    </div>
  );
}