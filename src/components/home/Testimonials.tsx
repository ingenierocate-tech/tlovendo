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