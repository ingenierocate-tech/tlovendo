export type VehicleImageData = { title?: string; image?: string | null }

const BRAND_FIX = new Map<string, string>([
  ['toyota','Toyota'],
  ['honda','Honda'],
  ['nissan','Nissan'],
  // agrega marcas aquí sin tocar el resto
])

function normalize(s = '') {
  return s
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')   // quita tildes
    .toLowerCase()
}

export function slugifyForImage(s: string) {
  return s
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // sin acentos
    .trim()
    .replace(/\s+/g, '_')                             // espacios -> _
    .replace(/[^A-Za-z0-9_]/g, '');                   // seguro
}

export function candidateImages(make?: string, model?: string, image?: string) {
  const m = make ? slugifyForImage(make) : '';
  const d = model ? slugifyForImage(model) : '';
  const base = m && d ? `/${m}_${d}` : '';
  const exts = ['png','jpg','jpeg','webp'];
  const lateral = exts.map(e => `${base}_lateral.${e}`);
  const frontal = exts.map(e => `${base}_frontal.${e}`);
  return [
    image || '',   // si viene absoluta o relativa
    ...lateral,
    ...frontal,
    '/placeholder-car.jpg',
  ].filter(Boolean);
}

export function inferBrandModelFromTitle(title = '') {
  const t = normalize(title)
  // modelos que quieres reconocer (fácil de extender)
  const models = ['corolla','civic','sentra','yaris','hilux','crv','accord']
  const brands = Array.from(BRAND_FIX.keys())

  const brand = brands.find(b => t.includes(b)) || ''
  const model = models.find(m => t.includes(m)) || ''
  return {
    brand: BRAND_FIX.get(brand) || '',
    model: model ? (model === 'crv' ? 'CRV' : model[0].toUpperCase()+model.slice(1)) : ''
  }
}

/**
 * Devuelve una lista de candidatos en orden de prueba.
 * 1) vehicle.image (si viene)
 * 2) /<Brand>_<Model>_lateral.(png|jpg|jpeg|webp)
 * 3) /placeholder-car.jpg
 */
export function candidateSources(v: VehicleImageData) {
  const candidates: string[] = []
  if (v.image) candidates.push(v.image)

  const { brand, model } = inferBrandModelFromTitle(v.title || '')
  if (brand && model) {
    const base = `/${brand}_${model}_lateral`
    for (const ext of ['.png','.jpg','.jpeg','.webp']) {
      candidates.push(`${base}${ext}`)
    }
  }
  candidates.push('/placeholder-car.jpg')
  return Array.from(new Set(candidates)) // sin duplicados
}

import type { Vehicle } from '@/types/vehicle';

/**
 * Obtiene la imagen principal de un vehículo de forma segura
 * Prioridad:
 * 1) vehicle.image (si existe y no es null)
 * 2) Primera imagen de vehicle.images con isPrimary=true
 * 3) Primera imagen de vehicle.images
 * 4) Placeholder por defecto
 */
export function getVehiclePrimaryImage(vehicle: Vehicle, fallback: string = '/placeholder-car.webp'): string {
    // 0) Priorizar siempre la imagen lateral si existe en el array de imágenes
    if (vehicle.images && Array.isArray(vehicle.images) && vehicle.images.length > 0) {
        const lateralFromList = vehicle.images.find(img => {
            const url = (img.url || '').toLowerCase();
            const alt = (img.alt || '').toLowerCase();
            return url.includes('_lateral.') || alt.includes('lateral');
        });
        if (lateralFromList && lateralFromList.url) {
            return lateralFromList.url;
        }
    }

    // 1) Usar vehicle.image solo si es lateral
    if (vehicle.image && vehicle.image.trim() !== '') {
        const imgLower = vehicle.image.toLowerCase();
        if (imgLower.includes('_lateral.')) {
            return vehicle.image;
        }
    }

    // 2) Si hay imágenes, usar marcada como primary; luego primera
    if (vehicle.images && Array.isArray(vehicle.images) && vehicle.images.length > 0) {
        const primaryImage = vehicle.images.find(img => img.isPrimary && img.url);
        if (primaryImage && primaryImage.url) {
            return primaryImage.url;
        }
        const firstImage = vehicle.images[0];
        if (firstImage && firstImage.url) {
            return firstImage.url;
        }
    }

    // 3) Fallback al placeholder
    return fallback;
}

/**
 * Obtiene todas las imágenes de un vehículo de forma segura
 * Retorna un array vacío si no hay imágenes
 */
export function getVehicleImages(vehicle: Vehicle): NonNullable<Vehicle['images']> {
  if (vehicle.images && Array.isArray(vehicle.images)) {
    return vehicle.images;
  }
  return [];
}

/**
 * Obtiene el alt text para una imagen de vehículo
 */
export function getVehicleImageAlt(vehicle: Vehicle, imageAlt?: string): string {
  const vehicleTitle = `${vehicle.brand || 'Vehículo'} ${vehicle.model || ''} ${vehicle.year || ''}`.trim();
  
  if (imageAlt && imageAlt.trim() !== '') {
    return `${vehicleTitle} - ${imageAlt}`;
  }
  
  return `${vehicleTitle} - TLoVendo`;
}