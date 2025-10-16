'use client'
import Image from 'next/image'

const steps = [
  {
    id: 1,
    image: '/HomePaso1.png',
    alt: 'Formulario simple para vender tu auto rápido y sin complicaciones',
    title: 'PASO 1',
    subtitle: 'Recopilamos la información de tu auto',
    description: 'Revisamos, fotografiamos y publicamos tu auto.',
    objectPosition: 'object-center'
  },
  {
    id: 2,
    image: '/HomePaso2.png',
    alt: 'Asesor automotriz profesional que gestiona la venta de tu vehículo',
    title: 'PASO 2',
    subtitle: 'Sin malos ratos',
    description: 'Nosotros coordinamos las visitas de los interesados, negociamos y cerramos la venta de tu auto.',
    objectPosition: 'object-top'
  },
  {
    id: 3,
    image: '/HomePaso3.png',
    alt: 'Cierre de trato con apretón de manos y pago seguro al vender tu auto',
    title: 'PASO 3',
    subtitle: 'Transferencias y pagos',
    description: 'Firmamos contratos y gestionamos el pago de manera confiable y segura.',
    objectPosition: 'object-center'
  }
]

export default function SellSteps() {
  return (
    <section className="bg-neutral-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Te ayudamos a vender tu auto
          </h2>
          <p className="text-xl sm:text-2xl font-semibold text-red-500">
            EN 3 SIMPLES PASOS
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {steps.map((step, index) => (
            <div key={`step-${step.id}`} className="text-center md:border-r md:border-white/20 last:md:border-r-0 px-2 md:px-6">
              {/* Image */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mx-auto mb-5 max-w-xs sm:max-w-sm md:max-w-md">
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  sizes="(max-width: 640px) 288px, (max-width: 1024px) 384px, 512px"
                  className={`object-cover ${step.objectPosition}`}
                  priority={false}
                />
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-red-500 font-semibold uppercase tracking-wide mt-2">
                  {step.title}
                </h3>
                <h4 className="mt-2 text-xl sm:text-2xl font-semibold">
                  {step.subtitle}
                </h4>
                <p className="mt-3 text-sm sm:text-base text-white/85 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}