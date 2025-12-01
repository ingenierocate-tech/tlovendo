import { FaCogs, FaGasPump, FaMapMarkerAlt, FaChevronRight } from 'react-icons/fa';
import { GiGearStickPattern } from 'react-icons/gi';
import Tag from './Tag';
import { Vehicle } from '@/types';

interface Props {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: Props) {
  const {
    brand,
    model,
    year,
    price,
    image,
    transmission,
    fuel,
    kilometers,
    region,
    slug,
  } = vehicle;

  return (
    <div className="border rounded-2xl overflow-hidden shadow hover:shadow-md transition-shadow duration-200">
      <a href={`/auto/${slug}`}>
        {/* Altura fija para uniformar las fotos */}
        <div className="overflow-hidden h-48 sm:h-52 md:h-56">
          <img
            src={image}
            alt={`${brand} ${model}`}
            className="object-cover w-full h-full"
          />
        </div>
      </a>
      <div className="p-3 space-y-1">
        <div className="font-medium text-sm">
          {brand} {model} {year}
        </div>
        <div className="font-bold text-lg">
          {typeof price === 'number'
            ? `$${price.toLocaleString('es-CL')}`
            : 'Consultar'}
        </div>
        {typeof price === 'number' && (
          <div className="text-xs text-green-600 font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            Precio final sin cargos ocultos
          </div>
        )}
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

        <a
          href={`/auto/${slug}`}
          className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-red-600 text-white font-semibold py-2 hover:bg-red-700 transition-colors"
        >
          Ver detalles
          <FaChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}