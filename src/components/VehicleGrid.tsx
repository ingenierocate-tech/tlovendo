// VehicleGrid.tsx
import VehicleCard from './VehicleCard';
import SoldVehicleCard from './SoldVehicleCard';
import type { Vehicle } from '@/types/vehicle';

interface Props {
  vehicles: Vehicle[];
  showSold?: boolean;
}

export default function VehicleGrid({ vehicles, showSold = false }: Props) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((vehicle) =>
        showSold ? (
          <SoldVehicleCard key={vehicle.id} vehicle={vehicle} />
        ) : (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        )
      )}
    </div>
  );
}