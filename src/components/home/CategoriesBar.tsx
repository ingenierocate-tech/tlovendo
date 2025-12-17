"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Vehicle } from '@/types/vehicle';
import { CATEGORIES, getVehicleCategory } from '@/lib/categoryUtils';

interface CategoriesBarProps {
  vehicles?: Vehicle[];
}

export default function CategoriesBar({ vehicles = [] }: CategoriesBarProps) {
  // Mostrar todas las categorías sin filtrar por stock
  const categoriesToShow = CATEGORIES;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-2xl bg-neutral-50/60 ring-1 ring-black/5 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
            Vende tu auto fácil y rápido
          </h1>
          <p className="mt-2 text-neutral-600">
            Publicación, visitas y cierre seguro.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {categoriesToShow.map((category) => (
            <Link
              key={category.slug}
              href={`/compra/categoria/${category.slug}`}
              className="block rounded-xl border border-neutral-200 bg-white px-4 py-4 text-center hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              <div className="flex flex-col items-center gap-3">
                <Image
                  src={category.icon}
                  alt={category.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
                <span className="text-sm text-neutral-700">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}