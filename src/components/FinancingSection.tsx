import Image from "next/image";

export default function FinancingSection() {
  const steps = [
    { label: "Elige tu auto favorito.", image: "/images/foto-auto.png" },
    { label: 'Haz clic en "Solicitar Financiamiento".', image: "/images/financiamiento.png" },
    { label: "Completa un breve formulario.", image: "/images/firma-contrato.png" },
    { label: "Un asesor te contactará para guiarte.", image: "/images/cliente-feliz.png" }
  ];

  // Número y texto global de WhatsApp (sanitizado y codificado)
  const whatsappNumber = "+56971087126";
  const whatsappMessage =
    "Hola, vengo desde la web de tlovendo.cl y necesito más información sobre las opciones de financiamiento por favor";
  const whatsappSanitized = whatsappNumber.replace(/[^\d]/g, "");
  const whatsappHref = `https://wa.me/${whatsappSanitized}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section className="w-full bg-white py-16 px-4 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="font-heading text-4xl font-bold text-neutral-900 mb-6">
          ¡Financia tu próximo auto de forma rápida, segura y sin complicaciones!
        </h2>
        <p className="text-lg text-neutral-700 mb-10">
          Trabajamos con diversas entidades financieras para ofrecerte opciones
          flexibles, asesoría personalizada y un proceso 100% online o presencial.
        </p>

        <div className="grid gap-6 md:grid-cols-4 text-left mb-10">
          {steps.map(({ label, image }, idx) => (
            <div
              key={idx}
              className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-md transition flex flex-col items-center text-center"
            >
              <Image src={image} alt={label} width={64} height={64} className="h-16 w-16 mb-3 object-contain" />
              <span className="text-gray-700 text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-600 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow hover:bg-green-700 transition"
        >
          Habla con un asesor por WhatsApp
        </a>

        <p className="text-sm text-gray-500 mt-4">
          O si prefieres, completa el formulario de contacto y te llamamos.
        </p>
        <a href="/contacto" className="mt-2 inline-block text-blue-600 hover:underline">
          Ir al formulario
        </a>
      </div>
    </section>
  );
}