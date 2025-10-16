import dynamic from 'next/dynamic'

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
  vehicle: {
    brand: string
    model: string
    version?: string
    year: number
  }
}

export default function VehicleContactButtonsWrapper({ vehicle }: VehicleContactButtonsWrapperProps) {
  return <VehicleContactButtons vehicle={vehicle} />
}