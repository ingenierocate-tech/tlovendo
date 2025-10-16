import VehicleCard from "@/components/VehicleCard";
import type { Vehicle } from "@/types/vehicle";

interface FeaturedVehiclesProps {
  vehicles: Vehicle[];
}

export default function FeaturedVehicles({ vehicles }: FeaturedVehiclesProps) {
  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">
          Vehículos Destacados
        </h2>
        <p className="mt-2 text-neutral-600">
          Descubre nuestra selección de autos en excelente estado
        </p>
        <div className="mt-8 rounded-lg border border-dashed p-8 text-center text-gray-500">
          No hay vehículos disponibles en este momento.
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
      {vehicles.map((vehicle) => (
        <VehicleCard 
          key={vehicle.slug} 
          vehicle={vehicle} 
          variant="home" 
        />
      ))}
    </div>
  );
}