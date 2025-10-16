import Image from 'next/image';

export default function OtherServices() {
  const services = [
    { src: '/Logo_Tlovendo.png', alt: 'TLoVendo', label: 'Plataforma - TLoVendo' },
    { src: '/logo_Tlopinto.jpg', alt: 'TLoPinto', label: 'Compra - TLoPinto' },
    { src: '/logo_Tlopreparo.jpg', alt: 'TLoPreparo', label: 'Compra - TLoPreparo' },
    { src: '/logo_Tasesoro.jpg', alt: 'Tasesoro', label: 'Venta - Tasesoro' },
  ];

  return (
    <section className="w-full bg-white py-10">
      <h2 className="text-center text-xl md:text-2xl font-bold mb-8">
        Otros servicios que te ayudan en tu camino con el auto
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-center text-center">
        {services.map((s, idx) => (
          <div key={idx} className="flex flex-col items-center space-y-2">
            <div className="w-35 h-35 relative">
              <Image
                src={s.src}
                alt={s.alt}
                width={140}
                height={140}
                className="object-contain w-full h-full"
                sizes="140px"
              />
            </div>
            <span className="text-sm text-gray-700">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}