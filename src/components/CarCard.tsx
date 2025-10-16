import Image from 'next/image';

interface Car {
  id: number;
  marca: string;
  modelo: string;
  anio: number;
  precio: string;
  km: number;
  image: string;
}

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  return (
    <div className="w-80 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Imagen del auto */}
      <div className="relative">
        <Image
          src={car.image}
          alt={`${car.marca} ${car.modelo}`}
          width={320}
          height={220}
          className="h-55 w-full object-cover"
          priority={false}
        />
      </div>

      {/* Contenido de la card */}
      <div className="p-4">
        {/* Marca y modelo */}
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          {car.marca} {car.modelo}
        </h3>
        
        {/* Año y kilómetros */}
        <p className="text-sm text-gray-600 mb-3">
          {car.anio} • {car.km.toLocaleString()} km
        </p>
        
        {/* Precio */}
        <p className="text-xl font-bold text-red-600">
          {car.precio}
        </p>
      </div>
    </div>
  );
}