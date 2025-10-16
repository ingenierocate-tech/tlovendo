'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
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
          Corretaje de automóviles
        </span>

        {/* Solo NAV a la derecha */}
        <div className="ml-auto flex items-center">
          <nav className="flex items-center gap-6 font-medium text-gray-800">
            <Link href="/compra" className="hover:text-gray-900">Comprar</Link>
            <Link href="/vender" className="hover:text-gray-900">Vender</Link>
            <Link href="/financiamiento" className="hover:text-gray-900">Financiamiento</Link>
            <Link href="/reparaciones" className="hover:text-gray-900">Servicios Adicionales</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}