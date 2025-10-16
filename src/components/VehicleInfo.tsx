import { CheckCircleIcon, DocumentCheckIcon } from '@heroicons/react/24/solid'

interface VehicleInfoProps {
  vehicle: any // Usar el tipo VehicleDetail en producción
}

export default function VehicleInfo({ vehicle }: VehicleInfoProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {/* Precio */}
      <div className="mb-6">
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {formatPrice(vehicle.price)}
        </div>
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircleIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Precio final sin cargos ocultos</span>
        </div>
      </div>

      {/* Características principales */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Año:</span>
          <span className="font-medium">{vehicle.year}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Kilómetros:</span>
          <span className="font-medium">{vehicle.kilometers.toLocaleString()} km</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Transmisión:</span>
          <span className="font-medium">{vehicle.transmission}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Combustible:</span>
          <span className="font-medium">{vehicle.fuel}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Región:</span>
          <span className="font-medium">{vehicle.region}</span>
        </div>
      </div>

      {/* Trust badges */}
      <div className="space-y-3 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <DocumentCheckIcon className="w-6 h-6 text-blue-600" />
          <div>
            <div className="font-medium text-gray-900">Autofact incluido</div>
            <div className="text-sm text-gray-600">Historial verificado</div>
          </div>
        </div>
      </div>
    </div>
  )
}