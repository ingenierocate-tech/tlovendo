"use client";

import Image from "next/image";
import Link from "next/link";

export default function VenderPage() {
  return (
    <main className="bg-black text-white">
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
              <span className="text-gray-500">Vender</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Contenedor principal con separaciones consistentes */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Título principal con separación de 48px desde breadcrumbs */}
        <div className="flex items-baseline justify-between border-b border-gray-700 pb-6 pt-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Vende tu auto fácil, rápido y seguro
          </h1>
        </div>

        {/* Sección Hero con separación de 48px desde título */}
        <section className="pt-6 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Columna izquierda - Imagen más pequeña */}
            <div className="order-2 lg:order-1">
              <Image 
                src="/images/cliente-llaves.png" 
                alt="Cliente feliz entregando llaves" 
                width={300}
                height={225}
                className="w-full max-w-sm mx-auto rounded-xl shadow-lg object-cover" 
                sizes="(max-width: 1024px) 100vw, 300px"
              />
            </div>
            
            {/* Columna derecha - Contenido */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <p className="mt-3 text-base sm:text-lg text-gray-300">Tú decides cómo hacerlo: nosotros nos encargamos del resto.</p> 
            </div>
          </div>
        </section>
      </div>

      {/* Sección Opciones de venta */}
      <section id="opciones" className="bg-neutral-900 text-white px-4 py-12 sm:px-6 lg:px-8"> 
        <div className="mx-auto max-w-6xl"> 
          <h2 className="text-center text-2xl sm:text-3xl font-bold">Opciones de venta</h2> 
          <p className="mt-2 text-center text-gray-300">Elige el camino que más te acomode. Nosotros nos encargamos del resto.</p> 

          <div className="mt-10 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2"> 
            <article className="rounded-2xl bg-neutral-800 p-6 ring-1 ring-white/10"> 
              <h3 className="text-lg font-semibold">Opción 1: Publicación asistida</h3> 
              <p className="mt-1 text-sm text-gray-300">Revisamos, fotografiamos y publicamos tu auto en los principales portales. Coordinamos visitas y te ayudamos a responder consultas.</p> 
              <Image 
                src="/images/foto-auto.png" 
                alt="Fotografía profesional de auto" 
                width={400}
                height={250}
                className="mt-4 w-full rounded-xl object-cover" 
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </article> 

            <article className="rounded-2xl bg-neutral-800 p-6 ring-1 ring-white/10"> 
              <h3 className="text-lg font-semibold">Opción 2: Compra inmediata ("me lo llevo")</h3> 
              <p className="mt-1 text-sm text-gray-300">Te hacemos una oferta rápida, pagamos y retiramos tu vehículo en el día. Cero complicaciones cuando necesitas liquidez inmediata.</p> 
              <Image 
                src="/images/pago-inmediato.png" 
                alt="Pago inmediato del vehículo" 
                width={400}
                height={250}
                className="mt-4 w-full rounded-xl object-cover" 
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </article> 

            <article className="rounded-2xl bg-neutral-800 p-6 ring-1 ring-white/10"> 
              <h3 className="text-lg font-semibold">Opción 3: Gestión completa ("sin malos ratos")</h3> 
              <p className="mt-1 text-sm text-gray-300">Nos encargamos de todo: visitas, negociación, contratos, transferencias y pagos. Tú solo recibes el dinero en tu cuenta.</p> 
              <Image 
                src="/images/firma-contrato.png" 
                alt="Firma de contrato de compraventa" 
                width={400}
                height={250}
                className="mt-4 w-full rounded-xl object-cover" 
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </article> 

            <article className="rounded-2xl bg-neutral-800 p-6 ring-1 ring-white/10"> 
              <h3 className="text-lg font-semibold">Opción 4: Venta con financiamiento</h3> 
              <p className="mt-1 text-sm text-gray-300">Ofrecemos tu auto con financiamiento aprobado. Más interesados, pago completo y seguro.</p> 
              <Image 
                src="/images/financiamiento.png" 
                alt="Comprador con financiamiento" 
                width={400}
                height={250}
                className="mt-4 w-full rounded-xl object-cover" 
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </article> 
          </div> 
        </div> 
      </section>

      {/* Sección Beneficios destacados */}
      <section id="beneficios" className="bg-black text-white px-4 py-16 sm:px-6 lg:px-8"> 
        <div className="mx-auto max-w-6xl"> 
          <h2 className="text-center text-2xl sm:text-3xl font-bold">Beneficios destacados</h2> 
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4"> 
            <li className="rounded-xl bg-neutral-800 p-4 text-center">
              <div className="text-2xl">🔒</div>
              <p className="mt-2 text-sm">Transferencia segura</p>
            </li> 
            <li className="rounded-xl bg-neutral-800 p-4 text-center">
              <div className="text-2xl">📄</div>
              <p className="mt-2 text-sm">Asesoría legal</p>
            </li> 
            <li className="rounded-xl bg-neutral-800 p-4 text-center">
              <div className="text-2xl">💸</div>
              <p className="mt-2 text-sm">Pago rápido</p>
            </li> 
            <li className="rounded-xl bg-neutral-800 p-4 text-center">
              <div className="text-2xl">✅</div>
              <p className="mt-2 text-sm">Cero estrés</p>
            </li> 
          </ul> 
        </div> 
      </section>

      {/* Sección Proceso */}
      <section id="proceso" className="bg-neutral-900 text-white px-4 py-16 sm:px-6 lg:px-8"> 
        <div className="mx-auto max-w-6xl"> 
          <h2 className="text-center text-2xl sm:text-3xl font-bold">Así de simple en 3 pasos</h2> 
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3"> 
            <div className="rounded-2xl bg-neutral-800 p-6 text-center"> 
              <div className="text-3xl">📝</div> 
              <h3 className="mt-2 font-semibold">Paso 1</h3> 
              <p className="mt-1 text-sm text-gray-300">Cuéntanos de tu auto</p> 
            </div> 
            <div className="rounded-2xl bg-neutral-800 p-6 text-center"> 
              <div className="text-3xl">📋</div> 
              <h3 className="mt-2 font-semibold">Paso 2</h3> 
              <p className="mt-1 text-sm text-gray-300">Elige tu opción de venta</p> 
            </div> 
            <div className="rounded-2xl bg-neutral-800 p-6 text-center"> 
              <div className="text-3xl">💳</div> 
              <h3 className="mt-2 font-semibold">Paso 3</h3> 
              <p className="mt-1 text-sm text-gray-300">Recibe el pago seguro</p> 
            </div> 
          </div> 
        </div> 
      </section>
      {/* Sección CTA Final */}
      <section id="cta-final" className="bg-black text-white px-4 py-16 sm:px-6 lg:px-8"> 
        <div className="mx-auto max-w-5xl text-center"> 
          <h2 className="text-2xl sm:text-3xl font-bold">Miles de personas ya vendieron su auto con nosotros</h2> 
          <p className="mt-2 text-gray-300">¿Listo para vender el tuyo?</p> 
          <figure className="mt-8 flex justify-center"> 
            <Image 
              src="/images/cliente-feliz.png" 
              alt="Cliente feliz recibiendo pago por su auto" 
              width={400}
              height={300}
              className="rounded-xl object-cover shadow-lg" 
              sizes="(max-width: 768px) 90vw, 400px"
            />
          </figure> 
        </div> 
      </section> 

    </main> 
  ); 
}