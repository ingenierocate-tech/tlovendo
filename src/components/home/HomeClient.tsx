'use client';

import React from 'react';
import type { Vehicle } from '@/types/vehicle';
import VehicleCard from '@/components/VehicleCard';
import HeroSlider from '@/components/HeroSliderImpl';
import CategoriesBar from './CategoriesBar';
import SellStepsDark from './SellStepsDark';
import Testimonials from './Testimonials';

type Props = { vehicles: Vehicle[] };

export default function HomeClient({ vehicles }: Props) {
  return (
    <main className="flex flex-col gap-16 overflow-x-hidden max-w-[100vw] box-border">
      {/* Hero + Categorías (BLANCO) */}
      <section className="bg-white w-full max-w-[100vw] box-border">
        <HeroSlider />
        <CategoriesBar />
      </section>

      {/* Vehículos Destacados (BLANCO) */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <header className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-neutral-900">Vehículos Destacados</h2>
            <p className="mt-1 text-neutral-600">Autos seleccionados especialmente para ti</p>
          </header>

          {vehicles?.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
              {vehicles.slice(0, 3).map((v) => (
                <VehicleCard key={v.slug} vehicle={v} variant="home" />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-300 p-8 text-center text-neutral-500">
              No hay vehículos destacados por ahora.
            </div>
          )}
        </div>
      </section>

      {/* En 3 simples pasos (NEGRO) */}
      <SellStepsDark />

      {/* Testimonios (BLANCO) */}
      <Testimonials />
    </main>
  );
}