'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center">
        {/* Logo y texto */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/Logo_Tlovendo.png" alt="TloVendo" className="h-10 md:h-12 w-auto" />
          <span className="text-base md:text-lg font-medium">Corretaje automóviles</span>
        </Link>
        {/* Navegación desktop */}
        <nav className="ml-auto hidden md:flex items-center gap-6">
          <Link href="/compra" className="font-bold hover:text-red-600">Comprar</Link>
          <Link href="/vender" className="font-bold hover:text-red-600">Vender</Link>
          <Link href="/financiamiento" className="font-bold hover:text-red-600">Financiamiento</Link>
          <Link href="/reparaciones" className="font-bold hover:text-red-600">Servicios Adicionales</Link>
        </nav>
        {/* Botón hamburguesa en mobile */}
        <button
          type="button"
          className="ml-auto inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 md:hidden"
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? (
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>
      {/* Menú móvil */}
      {isMenuOpen && (
        <div id="mobile-menu" className="md:hidden border-t">
          <nav className="px-4 py-3 flex flex-col gap-2">
            <Link href="/compra" className="font-bold" onClick={() => setIsMenuOpen(false)}>Comprar</Link>
            <Link href="/vender" className="font-bold" onClick={() => setIsMenuOpen(false)}>Vender</Link>
            <Link href="/financiamiento" className="font-bold" onClick={() => setIsMenuOpen(false)}>Financiamiento</Link>
            <Link href="/reparaciones" className="font-bold" onClick={() => setIsMenuOpen(false)}>Servicios Adicionales</Link>
          </nav>
        </div>
      )}
    </header>
  );
}