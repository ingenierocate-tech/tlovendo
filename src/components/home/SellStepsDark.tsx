'use client';

import Link from 'next/link';

export default function SellStepsDark() {
  const steps = [
    {
      t: 'Paso 1',
      d: 'Recopilamos la información de tu auto',
      img: '/HomePaso1.png',
    },
    {
      t: 'Paso 2',
      d: 'Coordinamos visitas y negociamos por ti',
      img: '/HomePaso2.png',
    },
    {
      t: 'Paso 3',
      d: 'Firmas y pago seguro',
      img: '/HomePaso3.png',
    },
  ];

  return (
    <section className="bg-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-white">Te ayudamos a vender tu auto</h2>
          <p className="mt-1 text-neutral-300">En 3 simples pasos</p>
        </header>

        <div className="grid gap-6 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.t} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-white/5 mb-4">
                {/* Si la imagen no existe, el fondo queda neutro */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.img}
                  alt={s.t}
                  className="h-full w-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
              <p className="text-sm text-white/70">{s.t}</p>
              <p className="mt-1 text-white">{s.d}</p>
            </div>
          ))}
        </div>

        {/* Botón CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/vender"
            className="inline-block rounded-md bg-red-600 px-8 py-3 text-white font-semibold hover:bg-red-700 transition-colors"
          >
            Vender mi auto
          </Link>
        </div>
      </div>
    </section>
  );
}