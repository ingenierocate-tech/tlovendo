import Link from 'next/link'
import { ExclamationTriangleIcon, HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function NotFound() {
  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <nav className="flex px-4 py-3 text-gray-700 border-b border-gray-200" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/" className="text-gray-700 hover:text-brand-red transition-colors">
              Inicio
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link href="/compra" className="text-gray-700 hover:text-brand-red transition-colors">
                Autos
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-500">Vehículo no encontrado</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Icono de error */}
          <div className="flex justify-center mb-8">
            <div className="bg-red-100 rounded-full p-6">
              <ExclamationTriangleIcon className="w-16 h-16 text-red-600" />
            </div>
          </div>

          {/* Título y descripción */}
          <h1 className="text-4xl font-bold text-gray-900 font-heading mb-4">
            Vehículo no encontrado
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Lo sentimos, el vehículo que buscas no existe o ha sido vendido. 
            Te invitamos a explorar nuestro catálogo completo para encontrar tu próximo auto.
          </p>

          {/* Estadísticas de error */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-md mx-auto">
            <div className="text-6xl font-bold text-gray-300 mb-2">404</div>
            <div className="text-sm text-gray-500">Página no encontrada</div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-brand-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              <HomeIcon className="w-5 h-5" />
              Ir al inicio
            </Link>
            
            <Link
              href="/compra"
              className="inline-flex items-center gap-2 bg-brand-red text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
              Ver catálogo
            </Link>
          </div>

          {/* Sugerencias */}
          <div className="mt-12 text-left max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 font-heading mb-4">
              ¿Qué puedes hacer?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Explora nuestro catálogo
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Tenemos más de 500 vehículos disponibles con diferentes marcas, modelos y precios.
                </p>
                <Link
                  href="/compra"
                  className="text-brand-red hover:text-red-700 font-medium text-sm transition-colors"
                >
                  Ver todos los autos →
                </Link>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Usa nuestros filtros
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Filtra por marca, precio, año, transmisión y encuentra exactamente lo que buscas.
                </p>
                <Link
                  href="/compra"
                  className="text-brand-red hover:text-red-700 font-medium text-sm transition-colors"
                >
                  Buscar con filtros →
                </Link>
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="mt-12 bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              ¿Necesitas ayuda?
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Nuestro equipo está disponible para ayudarte a encontrar el vehículo perfecto.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:+56223456789"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
              >
                📞 +56 2 2345 6789
              </a>
              <a
                href="https://wa.me/56987654321"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}