import { Metadata } from 'next'
import Link from 'next/link'
import { getVehicles } from '@/data/vehicles'
import type { Vehicle } from '@/types/vehicle'
import CatalogClient from './CatalogClient'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Catálogo de Autos | TLoVendo 🚘',
  description: 'Encuentra autos usados verificados sin cargos ocultos.',
}

export default async function CompraPage() {
  const vehicles: Vehicle[] = await getVehicles()

  if (!vehicles || vehicles.length === 0) {
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
          </ol>
        </nav>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 font-heading">Catálogo de Autos</h1>
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No se encontraron vehículos</h3>
            <p className="mt-1 text-sm text-gray-500">No hay vehículos disponibles en este momento</p>
          </div>
        </section>
      </div>
    )
  }

  return (
    <Suspense fallback={<div>Cargando catálogo...</div>}>
      <CatalogClient vehicles={vehicles} />
    </Suspense>
  )
}
