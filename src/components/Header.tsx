'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

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
                    Corretaje automóviles
                </span>

                {/* Botón hamburguesa en mobile */}
                <button
                    className="ml-auto inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 md:hidden"
                    aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                >
                    {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </button>

                {/* NAV en desktop (se mantiene igual) */}
                <div className="ml-auto hidden md:flex items-center">
                    <nav className="flex items-center gap-6 font-medium text-gray-800">
                        <Link href="/compra" className="hover:text-gray-900">Comprar</Link>
                        <Link href="/vender" className="hover:text-gray-900">Vender</Link>
                        <Link href="/financiamiento" className="hover:text-gray-900">Financiamiento</Link>
                        <Link href="/reparaciones" className="hover:text-gray-900">Servicios Adicionales</Link>
                    </nav>
                </div>
            </div>

            {/* Panel del menú en mobile */}
            {open && (
                <div className="md:hidden border-t border-gray-200 bg-white">
                    <nav className="px-4 py-3 flex flex-col gap-3 font-medium text-gray-800">
                        <Link href="/compra" className="hover:text-gray-900" onClick={() => setOpen(false)}>Comprar</Link>
                        <Link href="/vender" className="hover:text-gray-900" onClick={() => setOpen(false)}>Vender</Link>
                        <Link href="/financiamiento" className="hover:text-gray-900" onClick={() => setOpen(false)}>Financiamiento</Link>
                        <Link href="/reparaciones" className="hover:text-gray-900" onClick={() => setOpen(false)}>Servicios Adicionales</Link>
                    </nav>
                </div>
            )}
        </header>
    );
}