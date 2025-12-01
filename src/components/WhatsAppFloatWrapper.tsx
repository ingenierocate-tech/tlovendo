'use client'

import { usePathname } from 'next/navigation'
import WhatsAppFloat from './WhatsAppFloat'

export default function WhatsAppFloatWrapper() {
  const pathname = usePathname()
  
  const getMessageByPath = () => {
    if (pathname?.startsWith('/compra') || pathname?.startsWith('/auto/')) {
      return "Hola, vengo desde la web de tlovendo.cl y necesito más información sobre los autos en venta, por favor"
    }
    if (pathname?.startsWith('/vender')) {
      return "Hola, vengo desde la web de tlovendo.cl y necesito más información sobre las opciones para vender mi auto por favor"
    }
    if (pathname?.startsWith('/reparaciones')) {
      return "Hola, vengo desde la web de tlovendo.cl y necesito más información sobre los servicios de reparación, por favor"
    }
    return "Hola, vengo desde la web de tlovendo.cl y necesito más información, por favor"
  }
  
  return (
    <WhatsAppFloat 
      phone="+56971087126" 
      text={getMessageByPath()}
    />
  )
}