'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        {/* Logo grande */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src="/Logo_Tlovendo.png"
            alt="TLoVendo"
            width={200}
            height={60}
            priority
            className="h-[60px] w-auto"
          />
        </Link>

        {/* Texto al lado derecho del logo */}
        <span className="font-heading text-gray-900 text-base sm:text-lg font-semibold tracking-wide">
          Corretaje automóviles
        </span>

        {/* Controles de navegación */}
        <div className="ml-auto flex items-center">
          {/* Botón hamburguesa - visible solo en mobile */}
          <button
            type="button"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-600"
          >
            {menuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>

          {/* Menú horizontal - visible desde md+ */}
          <nav className="hidden md:flex items-center gap-6 font-medium text-gray-800">
            <Link href="/compra" className="hover:text-gray-900">Comprar</Link>
            <Link href="/vender" className="hover:text-gray-900">Vender</Link>
            <Link href="/financiamiento" className="hover:text-gray-900">Financiamiento</Link>
            <Link href="/reparaciones" className="hover:text-gray-900">Servicios Adicionales</Link>
          </nav>
        </div>
      </div>

      {/* Panel desplegable mobile */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-3 space-y-2">
            <Link href="/compra" className="block py-2 text-gray-800 hover:text-gray-900">Comprar</Link>
            <Link href="/vender" className="block py-2 text-gray-800 hover:text-gray-900">Vender</Link>
            <Link href="/financiamiento" className="block py-2 text-gray-800 hover:text-gray-900">Financiamiento</Link>
            <Link href="/reparaciones" className="block py-2 text-gray-800 hover:text-gray-900">Servicios Adicionales</Link>
          </nav>
        </div>
      )}
    </header>
  );
}