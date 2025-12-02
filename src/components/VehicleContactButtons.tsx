'use client'

import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

interface VehicleContactButtonsProps {
  vehicle: {
    brand: string
    model: string
    version?: string
    year: number | null
  }
}

export default function VehicleContactButtons({ vehicle }: VehicleContactButtonsProps) {
  const handleWhatsApp = () => {
    const yearText = vehicle.year != null ? `${vehicle.year}` : ''
    const message = `Hola, vengo desde la web de tlovendo.cl y necesito más información sobre el automóvil en venta ${vehicle.brand} ${vehicle.model} ${vehicle.version ? vehicle.version + ' ' : ''}${yearText}, por favor.`
    const whatsappNumber = '+56 9 7108 7126'
    const url = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <div className="w-full">
      <button
        onClick={handleWhatsApp}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duración-200 flex items-center justify-center gap-2"
      >
        <ChatBubbleLeftRightIcon className="w-5 h-5" />
        Contactar vendedor
      </button>
    </div>
  )
}