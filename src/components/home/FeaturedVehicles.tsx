"use client";

import VehicleCard from "@/components/VehicleCard";
import type { Vehicle } from "@/types/vehicle";

export default function FeaturedVehicles({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 mb-2">
        Vehículos Destacados
      </h2>
      <p className="text-neutral-600 mb-8">
        Descubre nuestra selección de autos en excelente estado
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((v) => (
          <VehicleCard key={v.slug} vehicle={v} />
        ))}
      </div>
    </div>
  );
}