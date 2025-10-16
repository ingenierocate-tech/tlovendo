'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Slide {
  id: string
  src: string
  alt: string
  title: string
  desc: string
  ctaLabel: string
  ctaHref: string
}

interface Props {
  slides?: Slide[]
}

// Slides por defecto
const defaultSlides: Slide[] = [
  { id: 's1', src: '/Slider1.png', alt: 'Llaves', title: 'Compra con confianza', desc: 'Gestión completa y segura', ctaLabel: 'Ver catálogo', ctaHref: '/compra' },
  { id: 's2', src: '/Slider2.png', alt: 'Velocidad', title: 'Financiamiento a tu medida', desc: 'Créditos con tasas competitivas', ctaLabel: 'Simular crédito', ctaHref: '/financiamiento' },
  { id: 's3', src: '/Slider3.png', alt: 'Entrega', title: 'Vende tu auto fácil y rápido', desc: 'Publicación, visitas y cierre seguro', ctaLabel: 'Vender auto', ctaHref: '/vender' },
];

export default function HeroSliderImpl({ slides = defaultSlides }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || slides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isMounted, slides.length])

  if (!isMounted) {
    return (
      <div className="relative h-[360px] w-full bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Cargando slider...</div>
      </div>
    )
  }

  if (!slides || slides.length === 0) {
    return (
      <div className="relative h-[360px] w-full bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">No hay slides disponibles</div>
      </div>
    )
  }

  const slide = slides[currentSlide]

  return (
    <div className="relative h-[360px] w-full overflow-hidden bg-black">
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        <Image
          src={slide.src}
          alt={slide.alt}
          fill
          className="object-cover"
          priority={currentSlide === 0}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {slide.title}
            </h1>
            <p className="mt-4 text-lg text-gray-200">
              {slide.desc}
            </p>
            <div className="mt-6">
              <Link
                href={slide.ctaHref}
                className="inline-block rounded-md bg-red-600 px-6 py-3 text-white font-semibold hover:bg-red-700 transition-colors"
              >
                {slide.ctaLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Controles de navegación */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
            aria-label="Slide anterior"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
            aria-label="Slide siguiente"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  )
}