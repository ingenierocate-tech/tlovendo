import { FaCogs, FaGasPump, FaMapMarkerAlt } from 'react-icons/fa';
import { GiGearStickPattern } from 'react-icons/gi';
import Tag from './Tag';
import TLVImage from './TLVImage';
import type { Vehicle } from '@/types/vehicle';

interface Props {
  vehicle: Vehicle;
}

export default function SoldVehicleCard({ vehicle }: Props) {
  const {
    image,
    brand,
    model,
    year,
    transmission,
    fuel,
    kilometers,
    region,
  } = vehicle;

  return (
    <div className="border rounded-2xl overflow-hidden shadow hover:shadow-md transition-shadow duration-200">
      <div className="relative overflow-hidden h-48 sm:h-52 md:h-56">
        <img
          src={image || '/placeholder-car.webp'}
          alt={`Foto ${brand} ${model}`}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 left-2 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded">
          VENDIDO
        </div>
      </div>
      <div className="p-3 space-y-1">
        <div className="font-medium text-sm">
          {brand} {model} {year}
        </div>
        <div className="font-bold text-lg text-red-600">Vendido</div>
        <div className="flex flex-wrap gap-1 pt-1">
          <Tag icon={GiGearStickPattern} text={transmission || 'No disponible'} />
          <Tag icon={FaGasPump} text={fuel || 'No disponible'} />
          <Tag
            icon={FaCogs}
            text={
              typeof kilometers === 'number'
                ? `${kilometers.toLocaleString()} km`
                : 'No disponible'
            }
          />
          <Tag icon={FaMapMarkerAlt} text={region || 'No disponible'} />
        </div>
      </div>
    </div>
  );
}