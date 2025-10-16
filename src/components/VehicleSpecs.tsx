import { CheckCircleIcon, ShieldCheckIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline'
import type { Vehicle } from '@/types/vehicle'

interface VehicleSpecsProps {
  vehicle: Vehicle
}

export default function VehicleSpecs({ vehicle }: VehicleSpecsProps) {
  // Validación defensiva
  if (!vehicle) {
    return (
      <div className="space-y-8">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 font-heading mb-6 flex items-center gap-2">
            <WrenchScrewdriverIcon className="w-6 h-6 text-brand-red" />
            Especificaciones Técnicas
          </h3>
          <div className="text-gray-500 text-sm italic">
            Cargando información del vehículo...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Especificaciones Técnicas */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 font-heading mb-6 flex items-center gap-2">
          <WrenchScrewdriverIcon className="w-6 h-6 text-brand-red" />
          Especificaciones Técnicas
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Motor y Rendimiento */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Motor y Rendimiento</h4>
            <div className="space-y-2 text-sm">
              {vehicle.engine && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Motor:</span>
                  <span className="font-medium">{vehicle.engine}L</span>
                </div>
              )}
              {vehicle.power && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Potencia:</span>
                  <span className="font-medium">{vehicle.power} HP</span>
                </div>
              )}
              {vehicle.consumption && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Consumo:</span>
                  <span className="font-medium">{vehicle.consumption}</span>
                </div>
              )}
              {vehicle.emissions && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Emisiones:</span>
                  <span className="font-medium">{vehicle.emissions}</span>
                </div>
              )}
              
              {/* Si no hay datos técnicos, mostrar mensaje */}
              {!vehicle.engine && !vehicle.power && !vehicle.consumption && !vehicle.emissions && (
                <div className="text-gray-500 text-sm italic">
                  Información técnica detallada disponible al contactar al vendedor
                </div>
              )}
            </div>
          </div>

          {/* Características de Seguridad y Confort */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Características</h4>
            <div className="space-y-1">
              {/* Características de Seguridad */}
              {vehicle.abs && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Sistema de frenos ABS</span>
                </div>
              )}
              {vehicle.esp && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Control de estabilidad (ESP)</span>
                </div>
              )}
              {vehicle.airbags && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Airbags: {vehicle.airbags}</span>
                </div>
              )}
              {vehicle.tractionControl && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Control de tracción</span>
                </div>
              )}
              
              {/* Características de Confort */}
              {vehicle.airConditioning && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Aire acondicionado</span>
                </div>
              )}
              {vehicle.powerSteering && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Dirección asistida</span>
                </div>
              )}
              {vehicle.electricWindows && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Alzavidrios eléctricos</span>
                </div>
              )}
              {vehicle.electricMirrors && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Espejos eléctricos</span>
                </div>
              )}
              {vehicle.audioSystem && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Sistema de audio</span>
                </div>
              )}
              {vehicle.bluetooth && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Bluetooth</span>
                </div>
              )}
              {vehicle.usb && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Puerto USB</span>
                </div>
              )}
              {vehicle.cruiseControl && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Control crucero</span>
                </div>
              )}
              
              {/* Si no hay características, mostrar mensaje */}
              {!vehicle.abs && !vehicle.esp && !vehicle.airbags && !vehicle.tractionControl && 
               !vehicle.airConditioning && !vehicle.powerSteering && !vehicle.electricWindows && 
               !vehicle.electricMirrors && !vehicle.audioSystem && !vehicle.bluetooth && 
               !vehicle.usb && !vehicle.cruiseControl && (
                <div className="text-gray-500 text-sm italic">
                  Características específicas disponibles al contactar al vendedor
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reporte Autofact */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 font-heading mb-4 flex items-center gap-2">
          <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
          Reporte Autofact
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Propietarios:</span>
            <span className="font-semibold text-gray-900">
              {vehicle.owners || 1} {(vehicle.owners || 1) === 1 ? 'propietario' : 'propietarios'}
            </span>
          </div>
          
          {vehicle.color && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Color:</span>
              <span className="font-semibold text-gray-900">{vehicle.color}</span>
            </div>
          )}
          
          <div className="text-sm text-gray-600">
            Reporte completo de Autofact disponible al contactar al vendedor
          </div>
        </div>
      </div>
    </div>
  )
}