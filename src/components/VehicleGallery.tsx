'use client'

import { useState } from 'react'
import TLVImage from '@/components/TLVImage'
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import type { Vehicle } from '@/types/vehicle'

interface VehicleGalleryProps {
  images: { url: string; alt?: string; isPrimary?: boolean }[]
  title?: string
  compact?: boolean
}

export default function VehicleGallery({ images, title, compact = false }: VehicleGalleryProps) {
  const items = Array.isArray(images) ? images : []
  const [currentImage, setCurrentImage] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % items.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + items.length) % items.length)
  }

  const openLightbox = (index: number) => {
    setCurrentImage(index)
    setShowLightbox(true)
  }

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className={`relative bg-gray-100 rounded-lg overflow-hidden cursor-pointer ${
        compact ? 'aspect-[4/3]' : 'aspect-[4/3]'
      }`}
           onClick={() => setShowLightbox(true)}>
        <TLVImage
          src={items[currentImage]?.url || '/placeholder-car.webp'}
          alt={items[currentImage]?.alt || 'Imagen del vehículo'}
          width={compact ? 600 : 800}
          height={compact ? 450 : 600}
          className="w-full h-full object-contain"
          priority
        />
        
        {/* Navegación */}
        {items.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </>
        )}
        
        {/* Indicador */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentImage + 1} / {items.length}
        </div>
      </div>

      {/* Thumbnails */}
      {items.length > 1 && (
        <div className={`grid gap-2 ${compact ? 'grid-cols-4' : 'grid-cols-5'}`}>
          {items.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`relative aspect-[16/9] rounded-lg overflow-hidden border-2 transition-colors ${
                index === currentImage ? 'border-brand-red' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <TLVImage
              src={image.url}
              alt={image.alt || 'Imagen del vehículo'}
              width={compact ? 100 : 120}
              height={compact ? 75 : 90}
              className={`w-full h-full object-cover cursor-pointer transition-opacity ${
                index === currentImage ? 'opacity-100' : 'opacity-60 hover:opacity-80'
              }`}
              onClick={() => setCurrentImage(index)}
            />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <TLVImage
              src={items[currentImage]?.url || '/placeholder-car.webp'}
              alt={items[currentImage]?.alt || 'Imagen del vehículo'}
              width={1200}
              height={900}
              className="max-w-full max-h-full object-contain"
              priority
            />
            
            {/* Cerrar */}
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            
            {/* Navegación en lightbox */}
            {items.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRightIcon className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}