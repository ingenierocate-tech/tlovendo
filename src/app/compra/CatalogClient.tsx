'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import VehicleCard from '@/components/VehicleCard'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import type { Vehicle } from '@/types/vehicle'

const sortOptions = [
  { name: 'Más Recientes', value: 'recent' },
  { name: 'Precio: Menor a Mayor', value: 'price-asc' },
  { name: 'Precio: Mayor a Menor', value: 'price-desc' },
  { name: 'Año: Más Nuevo', value: 'year-desc' },
  { name: 'Año: Más Antiguo', value: 'year-asc' },
  { name: 'Kilómetros: Menor', value: 'km-asc' },
  { name: 'Kilómetros: Mayor', value: 'km-desc' }
]

interface CatalogClientProps {
  vehicles: Vehicle[]
}

export default function CatalogClient({ vehicles }: CatalogClientProps) {
  const searchParams = useSearchParams()
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(vehicles)
  const [sortBy, setSortBy] = useState('recent')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSortChange = (value: string) => {
    setSortBy(value)
  }

  // Detectar vendidos por slugs específicos (Kia Sonet y Suzuki Alto)
  const soldSlugs = ['kia-sonet-2024-full', 'suzuki-alto-2022-800'];

  // Construir la lista de vendidos para la sección al final
  const soldVehicles = vehicles.filter((v) => soldSlugs.includes(v.slug));

  useEffect(() => {
    let filtered = [...vehicles]
    
    // Aplicar búsqueda
    if (searchQuery) {
      filtered = filtered.filter(v => 
        `${v.brand} ${v.model} ${v.version || ''} ${v.year}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    }

    // Aplicar ordenamiento
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => {
          const priceA = a.price || 0
          const priceB = b.price || 0
          return priceA - priceB
        })
        break
      case 'price-desc':
        filtered.sort((a, b) => {
          const priceA = a.price || 0
          const priceB = b.price || 0
          return priceB - priceA
        })
        break
      case 'year-desc':
        filtered.sort((a, b) => b.year - a.year)
        break
      case 'year-asc':
        filtered.sort((a, b) => a.year - b.year)
        break
      case 'km-asc':
        filtered.sort((a, b) => {
          const kmA = typeof a.kilometers === 'number' ? a.kilometers : 0
          const kmB = typeof b.kilometers === 'number' ? b.kilometers : 0
          return kmA - kmB
        })
        break
      case 'km-desc':
        filtered.sort((a, b) => {
          const kmA = typeof a.kilometers === 'number' ? a.kilometers : 0
          const kmB = typeof b.kilometers === 'number' ? b.kilometers : 0
          return kmB - kmA
        })
        break
      case 'recent':
      default:
        filtered.sort((a, b) => {
          if (a.publishedAt && b.publishedAt) {
            return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
          }
          return b.id - a.id
        })
        break
    }

    // Excluir vendidos del catálogo
    filtered = filtered.filter(v => !soldSlugs.includes(v.slug))
    setFilteredVehicles(filtered)
  }, [vehicles, searchQuery, sortBy])

  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <nav className="flex px-4 py-3 text-gray-700 border-b border-gray-200" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/" className="text-gray-700 hover:text-brand-red">
              Inicio
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-500">Comprar</span>
            </div>
          </li>
          {searchQuery && (
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">Búsqueda: {searchQuery}</span>
              </div>
            </li>
          )}
        </ol>
      </nav>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 font-heading">
            {searchQuery ? `Resultados para "${searchQuery}"` : 'Catálogo de Autos'}
          </h1>

          <div className="flex items-center">
            <div className="relative inline-block text-left">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none block w-full min-w-[200px] rounded-lg border-2 border-gray-200 bg-white py-3 pl-4 pr-12 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-brand-red hover:shadow-md focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-opacity-20 cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value} className="py-2">
                      {option.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDownIcon className="h-5 w-5 text-gray-400 transition-transform duration-200" />
                </div>
              </div>
              <div className="absolute -top-2 left-3 px-2 bg-white text-xs font-medium text-gray-500">
                Ordenar por
              </div>
            </div>
          </div>
        </div>

        <section aria-labelledby="products-heading" className="pb-24 pt-6">
          <h2 id="products-heading" className="sr-only">
            Vehículos
          </h2>

          {/* Vehicle grid - Sin filtros laterales, ocupando todo el ancho */}
          <div className="w-full">
            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-700">
                Mostrando {filteredVehicles.length} vehículos
              </p>
            </div>

            {filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No se encontraron vehículos</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery ? 'Intenta con otros términos de búsqueda' : 'No hay vehículos disponibles en este momento'}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Nueva sección: Autos vendidos */}
        <section className="border-t border-gray-200 pt-10 mt-16 pb-24">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 font-heading">
            Autos vendidos
          </h2>
          <p className="text-gray-600 mb-6">
            Estos vehículos ya encontraron un nuevo dueño.
          </p>
          {soldVehicles.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {soldVehicles.map((vehicle) => (
                <VehicleCard key={`sold-${vehicle.id}`} vehicle={vehicle} hideDetailsCTA sold />
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              Aún no hay autos vendidos publicados.
            </div>
          )}
        </section>
      </div>
    </div>
  )
}