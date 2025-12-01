// lib/vehicleHelpers.ts

import { Vehicle } from '@/types/vehicle';

// Utilidad para ordenar los vehículos alfabéticamente por marca y modelo
export function sortVehicles(vehicles: Vehicle[]): Vehicle[] {
  return vehicles.sort((a, b) => {
    const nameA = `${a.model} ${a.version}`.toLowerCase();
    const nameB = `${b.model} ${b.version}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });
}