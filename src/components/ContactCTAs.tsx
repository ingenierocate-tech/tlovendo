'use client'
import { PhoneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

interface ContactCTAsProps {
  vehicle: any
}

export default function ContactCTAs({ vehicle }: ContactCTAsProps) {
  // Verificar si vehicle existe y si location es un objeto o string
  const hasLocationObject = vehicle && vehicle.location && typeof vehicle.location === 'object'
  const defaultPhone = '+56 2 2345 6789'
  const defaultWhatsApp = '+56 9 7108 7126'  // Número actualizado
  
  // Si vehicle no existe, no renderizar el componente
  if (!vehicle) {
    return null
  }
  
  const handleWhatsApp = () => {
    const message = `Hola, vengo desde la web de tlovendo.cl y necesito más información sobre el automóvil en venta ${vehicle.brand} ${vehicle.model} ${vehicle.version ? vehicle.version + ' ' : ''}${vehicle.year}, por favor.`
    const whatsappNumber = hasLocationObject ? vehicle.location.whatsapp : defaultWhatsApp
    const url = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const handleCall = () => {
    const phoneNumber = hasLocationObject ? vehicle.location.phone : defaultPhone
    window.location.href = `tel:${phoneNumber}`
  }



  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Contactar vendedor</h3>
      
      <div className="space-y-3">
        <button
          onClick={handleWhatsApp}
          className="w-full flex items-center justify-center gap-3 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          <ChatBubbleLeftRightIcon className="w-5 h-5" />
          WhatsApp
        </button>
        
        <button
          onClick={handleCall}
          className="w-full flex items-center justify-center gap-3 bg-brand-red text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
        >
          <PhoneIcon className="w-5 h-5" />
          Llamar ahora
        </button>
      </div>
    </div>
  )
}