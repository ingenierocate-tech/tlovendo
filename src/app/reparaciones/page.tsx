'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Testimonials from '@/components/Testimonials';

export default function ReparacionesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Breadcrumbs */}
      <nav className="flex px-4 py-3 text-gray-700 border-b border-gray-200 bg-white" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/" className="text-gray-700 hover:text-brand-red">
              Inicio
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-500">Servicios adicionales</span>
            </div>
          </li>
        </ol>
      </nav>
      
      {/* Hero Section - Sin franja roja */}
      <section className="bg-black text-white pt-6 pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold">Servicios adicionales</h1>
          <p className="mt-2 text-gray-300">Preparación y acondicionamiento para tu auto.</p>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 pb-8">
        <div className="grid grid-cols-1 gap-12 lg:gap-16">
          
          {/* TLoPinto */}
          <div className="bg-neutral-900 rounded-2xl shadow-lg overflow-hidden border border-neutral-800">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <Image 
                  src="/logo_Tlopinto.jpg" 
                  alt="TLoPinto Logo" 
                  width={60} 
                  height={60} 
                  className="rounded-full"
                />
                <div>
                  <h2 className="text-2xl font-bold text-white">TLoPinto</h2>
                  <p className="text-gray-400">Pintura y detailing profesional</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-8 text-lg">
                Transformamos tu vehículo con servicios de pintura profesional y detailing de alta calidad. 
                Desde reparaciones menores hasta trabajos completos de carrocería.
              </p>
              
              {/* Antes y Después TLoPinto - Mismo tamaño */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-3 text-white">Antes</h3>
                  <div className="relative w-full h-[240px] rounded-xl shadow-md overflow-hidden bg-neutral-900 p-2">
                    <Image
                      src="/images/auto_tlopinto_antes.png"
                      alt="Auto antes del servicio TLoPinto"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-3 text-white">Después</h3>
                  <div className="relative w-full h-[240px] rounded-xl shadow-md overflow-hidden bg-neutral-900 p-2">
                    <Image
                      src="/images/auto_tlopinto.png"
                      alt="Auto después del servicio TLoPinto"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-white">Servicios incluidos:</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    Pintura completa o parcial
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    Reparación de rayones
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    Detailing profesional
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    Pulido y encerado
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    Restauración de faros
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    Protección de pintura
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* TLoPreparo */}
          <div className="bg-neutral-900 rounded-2xl shadow-lg overflow-hidden border border-neutral-800">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <Image 
                  src="/logo_Tlopreparo.jpg" 
                  alt="TLoPreparo Logo" 
                  width={60} 
                  height={60} 
                  className="rounded-full"
                />
                <div>
                  <h2 className="text-2xl font-bold text-white">TLoPreparo</h2>
                  <p className="text-gray-400">Limpieza profunda y preparación</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-8 text-lg">
                Preparamos tu vehículo para la venta o simplemente para que luzca como nuevo. 
                Limpieza profunda interior y exterior con técnicas profesionales.
              </p>
              
              {/* Antes y Después TLoPreparo - Mismo tamaño */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-3 text-white">Antes</h3>
                  <div className="relative w-full h-[240px] rounded-xl shadow-md overflow-hidden bg-neutral-900 p-2">
                    <Image
                      src="/images/auto_tlopreparo_antes.png"
                      alt="Auto antes del servicio TLoPreparo"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-3 text-white">Después</h3>
                  <div className="relative w-full h-[240px] rounded-xl shadow-md overflow-hidden bg-neutral-900 p-2">
                    <Image
                      src="/images/auto_tlopreparo.png"
                      alt="Auto después del servicio TLoPreparo"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-white">Servicios incluidos:</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    Limpieza profunda interior
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    Lavado exterior completo
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    Aspirado y shampoo de tapices
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    Limpieza de motor
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    Acondicionamiento de cueros
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    Preparación para venta
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-white">¿Listo para transformar tu auto?</h2>
            <p className="text-lg mb-6 text-gray-300">
              Contáctanos y obtén una cotización personalizada para los servicios que necesitas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/56971087126?text=Hola, me interesa conocer más sobre los servicios de TLoPinto y TLoPreparo" 
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Contactar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <div className="bg-black">
        <div className="[&>section]:bg-black [&>section>div>div>h2]:text-white [&>section>div>div>p]:text-gray-300 [&_figure]:bg-neutral-900 [&_figure]:border-neutral-800 [&_blockquote_p]:text-gray-300 [&_figcaption_div:first-child]:bg-neutral-800 [&_figcaption_div:first-child]:text-gray-300 [&_.font-semibold]:text-white [&_.text-gray-500]:text-gray-400">
          <Testimonials />
        </div>
      </div>
    </div>
  );
}