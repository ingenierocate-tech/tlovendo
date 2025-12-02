import dynamic from 'next/dynamic'
import type { Vehicle } from '@/types/vehicle'

const VehicleContactButtons = dynamic(() => import('./VehicleContactButtons'), {
  ssr: false,
  loading: () => (
    <div className="flex gap-2">
      <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
    </div>
  )
})

interface VehicleContactButtonsWrapperProps {
  vehicle: Pick<Vehicle, 'brand' | 'model' | 'version' | 'year'>
}

export default function VehicleContactButtonsWrapper({ vehicle }: VehicleContactButtonsWrapperProps) {
  return <VehicleContactButtons vehicle={vehicle} />
}