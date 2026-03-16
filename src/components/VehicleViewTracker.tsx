'use client'

import { useEffect } from 'react'

interface VehicleViewTrackerProps {
  vehicle: {
    brand: string
    model: string
    version?: string
    year: number | null
  }
}

export default function VehicleViewTracker({ vehicle }: VehicleViewTrackerProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'view_vehicle', {
        vehicle_brand: vehicle.brand,
        vehicle_model: vehicle.model,
        vehicle_version: vehicle.version ?? '',
        vehicle_year: vehicle.year ?? ''
      })
    }
  }, [vehicle])

  return null
}