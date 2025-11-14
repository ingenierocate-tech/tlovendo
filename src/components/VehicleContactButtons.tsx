'use client';
import React from 'react';
import { Phone } from 'lucide-react';

interface VehicleContactButtonsProps {
  vehicle: {
    brand: string;
    model: string;
    version?: string;
    year: number;
  };
}

export default function VehicleContactButtons({ vehicle }: VehicleContactButtonsProps) {
  const hasVehicleData = Boolean(vehicle?.brand && vehicle?.model && vehicle?.year);
  const vehicleTitle = hasVehicleData
    ? `${vehicle.brand} ${vehicle.model}${vehicle.version ? ` ${vehicle.version}` : ''} ${vehicle.year}`
    : '';
  const contactMessage = hasVehicleData
    ? `Hola, vi el ${vehicleTitle} publicado en tlovendo.cl y me gustaría tener más información. ¿Está disponible?`
    : 'Hola, vengo desde la web de tlovendo.cl y necesito más información, por favor.';
  const phoneNumber = '+56971087126';

  const handleWhatsApp = () => {
    const whatsappNumber = phoneNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(contactMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={handleWhatsApp}
        className="w-full inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <Phone className="mr-2 h-4 w-4" />
        Contactar vendedor
      </button>
    </div>
  );
}