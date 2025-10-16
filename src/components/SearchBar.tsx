'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Categorías de vehículos
const categories = [
  {
    name: 'Sedán',
    slug: 'sedan',
    image: '/Toyota_Corolla_lateral.png'
  },
  {
    name: 'SUV',
    slug: 'suv', 
    image: '/Honda_civic_lateral.png'
  },
  {
    name: 'Hatchback',
    slug: 'hatchback',
    image: '/Nissan_sentra_lateral.jpeg'
  },
  {
    name: 'Pickup',
    slug: 'pickup',
    image: '/placeholder-car.jpg'
  }
]

export default function SearchBar() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)

  // Control de montaje para hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/compra?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  const handleCategoryClick = (categorySlug: string) => {
    router.push(`/compra?categoria=${categorySlug}`)
  }

  // Mostrar un placeholder simple hasta que se monte
  if (!mounted) {
    return (
      <section className="bg-white py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">¿Qué auto buscas?</h2>
          <p className="text-gray-600 mb-8">
            Explora por tipo de vehículo o busca directamente en nuestro catálogo.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {categories.map((cat) => (
              <div key={cat.name} className="flex flex-col items-center">
                <div className="h-28 bg-gray-200 rounded mb-2 w-full"></div>
                <span className="font-medium">{cat.name}</span>
              </div>
            ))}
          </div>
          <div className="max-w-xl mx-auto flex items-center">
            <input
              type="text"
              placeholder="Buscar por marca o modelo..."
              className="flex-grow border rounded-l px-4 py-2"
              disabled
            />
            <button className="bg-red-600 text-white px-6 py-2 rounded-r" disabled>
              Buscar
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl font-bold mb-2">¿Qué auto buscas?</h2>
        <p className="text-gray-600 mb-8">
          Explora por tipo de vehículo o busca directamente en nuestro catálogo.
        </p>

        {/* Categorías dinámicas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className="flex flex-col items-center hover:transform hover:scale-105 transition-transform duration-200"
              onClick={() => handleCategoryClick(cat.slug)}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="h-28 object-contain mb-2 rounded-lg"
              />
              <span className="font-medium">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Buscador */}
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por marca o modelo..."
            className="flex-grow border rounded-l px-4 py-2 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all"
          />
          <button 
            type="submit"
            className="bg-red-600 text-white px-6 py-2 rounded-r hover:bg-red-700 transition-colors"
          >
            Buscar
          </button>
        </form>
      </div>
    </section>
  )
}