import Image from 'next/image'
import Link from 'next/link'
import { PhoneIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline'

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Image
              src="/Logo_Tlovendo.png"
              alt="TLoVendo.cl"
              width={200}
              height={50}
              className="h-12 w-auto mb-4"
            />
            <p className="text-gray-300 mb-4">
              La plataforma más confiable para comprar y vender autos usados en Chile.
            </p>
            <div className="flex items-center space-x-2 text-gray-300 mb-2">
              <PhoneIcon className="h-4 w-4" />
              <a href="tel:+56971087126" className="hover:text-white">
                +56 9 7108 7126
              </a>
            </div>
            <div className="flex items-center space-x-2 text-gray-300 mb-2">
              <MapPinIcon className="h-4 w-4" />
              <span>Santiago, Chile</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <ClockIcon className="h-4 w-4" />
              <span>Lun - Vie: 9:00 - 18:00</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li><Link href="/compra" className="text-gray-300 hover:text-white">Catálogo de autos</Link></li>
              <li><Link href="/vender" className="text-gray-300 hover:text-white">Vender mi auto</Link></li>
              <li><Link href="/financiamiento" className="text-gray-300 hover:text-white">Financiamiento</Link></li>
              <li><Link href="/reparaciones" className="text-gray-300 hover:text-white">Reparaciones</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Otros servicios</h3>
            <div className="space-y-6">
              <Link href="/servicios-adicionales" className="block group">
                <Image
                  src="/logo_Tlopreparo.jpg"
                  alt="TLoPreparo"
                  width={200}
                  height={60}
                  className="h-12 w-auto mb-1"
                />
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                  Preparación y acondicionamiento de vehículos
                </p>
              </Link>
              <Link href="/servicios-adicionales" className="block group">
                <Image
                  src="/logo_Tlopinto.jpg"
                  alt="TLoPinto"
                  width={200}
                  height={60}
                  className="h-12 w-auto mb-1"
                />
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                  Servicios de pintura y carrocería
                </p>
              </Link>
              <Link href="/financiamiento" className="block group">
                <Image
                  src="/logo_Tasesoro.jpg"
                  alt="Tasesoro"
                  width={200}
                  height={60}
                  className="h-12 w-auto mb-1"
                />
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                  Tasaciones y evaluaciones vehiculares
                </p>
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Ayuda</h3>
            <ul className="space-y-2">
              <li><Link href="/faqs" className="text-gray-300 hover:text-white">Preguntas frecuentes</Link></li>
              <li><Link href="/contacto" className="text-gray-300 hover:text-white">Contacto</Link></li>
              <li><Link href="/testimonios" className="text-gray-300 hover:text-white">Testimonios</Link></li>
              <li>
                <a 
                  href="https://wa.me/56971087126" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 TLoVendo.cl. Todos los derechos reservados.
          </div>
          <div className="flex space-x-6 text-sm">
            <Link href="/privacidad" className="text-gray-400 hover:text-white">
              Política de privacidad
            </Link>
            <Link href="/terminos" className="text-gray-400 hover:text-white">
              Términos y condiciones
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}