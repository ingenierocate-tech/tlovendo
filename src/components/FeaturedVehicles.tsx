import VehicleCard from "@/components/VehicleCard";
import type { Vehicle } from "@/types/vehicle";

interface FeaturedVehiclesProps {
  vehicles: Vehicle[];
}

export default function FeaturedVehicles({ vehicles }: FeaturedVehiclesProps) {
  return (
    <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
      {vehicles.map((vehicle) => (
        <VehicleCard 
          key={vehicle.slug} 
          vehicle={vehicle} 
        />
      ))}
    </div>
  );
}