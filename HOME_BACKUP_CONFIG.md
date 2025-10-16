# 🏠 CONFIGURACIÓN HOME - BACKUP COMPLETO
*Fecha: $(date)*

## 📋 RESUMEN DE LA CONFIGURACIÓN ACTUAL

### ✅ COMPONENTES PRINCIPALES FUNCIONANDO:
1. **HeroSlider** - Slider con botones, texto y puntos ✨
2. **Vehículos Destacados** - Mostrando 3 autos con campo `featured` ✨
3. **SellStepsDark** - 3 pasos + botón "Vender mi auto" ✨
4. **Testimonials** - Diseño con estrellitas y avatares ✨

---

## 🔧 ARCHIVOS CLAVE Y SUS CONFIGURACIONES

### 1. HomeClient.tsx
**Ubicación:** `/src/components/home/HomeClient.tsx`
**Import clave:** `import HeroSlider from '@/components/HeroSliderImpl';`

```tsx
'use client';

import React from 'react';
import type { Vehicle } from '@/types/vehicle';
import VehicleCard from '@/components/VehicleCard';
import HeroSlider from '@/components/HeroSliderImpl'; // ⚠️ IMPORTANTE: Usar HeroSliderImpl
import CategoriesBar from './CategoriesBar';
import SellStepsDark from './SellStepsDark';
import Testimonials from './Testimonials';

type Props = { vehicles: Vehicle[] };

export default function HomeClient({ vehicles }: Props) {
  return (
    <main className="flex flex-col gap-16">
      {/* Hero + Categorías (BLANCO) */}
      <section className="bg-white">
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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.slice(0, 3).map((v) => (
                <VehicleCard key={v.slug} vehicle={v} />
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
```

### 2. SellStepsDark.tsx
**Ubicación:** `/src/components/home/SellStepsDark.tsx`
**Características:** Fondo negro + botón rojo "Vender mi auto"

```tsx
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
```

### 3. Testimonials.tsx
**Ubicación:** `/src/components/home/Testimonials.tsx`
**Características:** Estrellitas doradas + avatares + fondo gris

```tsx
'use client';

export default function Testimonials() {
  const testimonials = [
    { 
      quote: 'La venta fue rápida y transparente. ¡Recomendados!', 
      author: 'María G.',
      rating: 5
    },
    { 
      quote: 'Cero estrés, se encargaron de todo el proceso.', 
      author: 'Rodrigo P.',
      rating: 5
    },
    { 
      quote: 'Buen precio y gestión muy profesional.', 
      author: 'Camila S.',
      rating: 5
    },
  ];

  const StarIcon = () => (
    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Lo que dicen nuestros clientes
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Testimonios reales de personas que confiaron en nosotros
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-lg p-8 relative transform hover:scale-105 transition-transform duration-300"
            >
              {/* Comillas decorativas */}
              <div className="absolute top-4 left-4 text-6xl text-red-100 font-serif leading-none">
                "
              </div>
              
              {/* Estrellas */}
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>

              {/* Testimonio */}
              <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 relative z-10">
                {testimonial.quote}
              </blockquote>

              {/* Autor */}
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.author.charAt(0)}
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">Cliente verificado</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Estadística adicional */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-md">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} />
              ))}
            </div>
            <span className="text-gray-700 font-semibold">4.9/5 basado en 150+ reseñas</span>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### 4. page.tsx (Configuración dinámica)
**Ubicación:** `/src/app/page.tsx`
**Configuración clave:** `export const dynamic = 'force-dynamic';`

```tsx
import { getLocalVehicles } from '@/data/local';
import HomeClient from '@/components/home/HomeClient';

export const dynamic = 'force-dynamic'; // ⚠️ IMPORTANTE: Para que los vehículos se muestren

export default async function HomePage() {
  const vehicles = await getLocalVehicles();
  return <HomeClient vehicles={vehicles} />;
}
```

### 5. vehicles.local.json (Primeros 3 vehículos con featured: true)
**Ubicación:** `/src/data/vehicles.local.json`
**Configuración:** Los primeros 3 vehículos deben tener `"featured": true`

---

## 🚨 PUNTOS CRÍTICOS PARA RESTAURAR:

1. **HeroSlider:** Usar `HeroSliderImpl` NO `HeroSlider` simple
2. **Vehículos:** Campo `featured: true` en los primeros 3 del JSON
3. **page.tsx:** Debe tener `export const dynamic = 'force-dynamic';`
4. **SellStepsDark:** Debe incluir el botón "Vender mi auto" al final
5. **Testimonials:** Diseño con estrellitas y fondo gris

---

## 📝 COMANDOS DE VERIFICACIÓN:

```bash
# Verificar que el servidor esté corriendo
npm run dev

# Verificar sintaxis del JSON
node -e "console.log('JSON válido:', JSON.parse(require('fs').readFileSync('./src/data/vehicles.local.json', 'utf8')).vehicles.length)"
```

---

## 🔄 PASOS PARA RESTAURAR SI SE DESARMA:

1. Verificar import en `HomeClient.tsx`: debe ser `HeroSliderImpl`
2. Verificar `page.tsx` tenga `export const dynamic = 'force-dynamic';`
3. Verificar JSON tenga `featured: true` en primeros 3 vehículos
4. Verificar `SellStepsDark.tsx` tenga el botón "Vender mi auto"
5. Verificar `Testimonials.tsx` tenga el diseño con estrellitas

**¡CONFIGURACIÓN GUARDADA EXITOSAMENTE! 🎉**