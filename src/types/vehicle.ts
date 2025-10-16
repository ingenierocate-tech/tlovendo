export type Vehicle = {
  id: number;
  slug: string;
  brand: string;
  model: string;
  version?: string;
  year: number;
  price?: number | null;
  kilometers?: number | null;
  transmission: 'Manual' | 'Automática' | string;
  fuel: 'Bencina' | 'Gasolina' | 'Diésel' | 'Híbrido' | 'Eléctrico' | string;
  region: string;
  image?: string | null;
  images?: { url: string; alt?: string; isPrimary?: boolean }[];
  publishedAt?: string;
  featured?: boolean;
  description?: string;
  
  // Campos adicionales del Google Sheet
  owners: number; // Dueños - nunca puede ser 0, default 1
  color?: string;
  status?: string; // Estado
  engine?: string; // Motor
  power?: string; // Potencia
  consumption?: string; // Consumo
  emissions?: string; // Emisiones
  
  // Características de seguridad
  abs?: boolean;
  esp?: boolean;
  airbags?: string;
  tractionControl?: boolean; // Control de tracción
  
  // Características de confort
  airConditioning?: boolean; // Aire acondicionado
  powerSteering?: boolean; // Dirección asistida
  electricWindows?: boolean; // Alzavidrios eléctricos
  electricMirrors?: boolean; // Espejos eléctricos
  audioSystem?: boolean; // Sistema de audio
  bluetooth?: boolean;
  usb?: boolean;
  cruiseControl?: boolean; // Control crucero
  
  // Vínculo (URL adicional)
  link?: string;
};