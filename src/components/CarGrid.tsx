import CarCard from './CarCard';

interface Car {
  id: number;
  marca: string;
  modelo: string;
  anio: number;
  precio: string;
  km: number;
  image: string;
}

interface CarGridProps {
  cars: Car[];
}

export default function CarGrid({ cars }: CarGridProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Grid responsivo optimizado para cards grandes */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
        {cars.map((car) => (
          <div key={car.id} className="flex justify-center">
            <CarCard car={car} />
          </div>
        ))}
      </div>
    </div>
  );
}