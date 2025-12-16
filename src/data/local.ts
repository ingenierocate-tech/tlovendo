import type { Vehicle } from '@/types/vehicle';
import vehiclesJson from '@/data/vehicles.local.json';
import slugsJson from '@/data/vehicles.slugs.local.json';
import { completeVehicleGalleryFromDisk } from '@/data/local-dev-gallery';

function normalizeImages(v: any): { url: string; alt?: string; isPrimary?: boolean }[] {
  const label = `${v.brand ?? ''} ${v.model ?? ''} ${v.year ?? ''}`.trim();

  const imgs = v.images ?? [];
  if (Array.isArray(imgs) && imgs.length > 0) {
    // Caso problemático: array de strings → convertir a objetos
    if (typeof imgs[0] === 'string') {
      return imgs
        .filter(Boolean)
        .map((url: string, idx: number) => ({ url, alt: label || undefined, isPrimary: idx === 0 }));
    }
    // Ya son objetos
    return imgs;
  }
  // Sin images: usar image si existe
  if (typeof v.image === 'string' && v.image) {
    return [{ url: v.image, alt: label || undefined, isPrimary: true }];
  }
  return [];
}

/**
 * Lee los vehículos desde el archivo JSON local (importación estática)
 * @returns Array de vehículos o array vacío
 */
export async function getLocalVehicles(): Promise<Vehicle[]> {
  const raw = Array.isArray(vehiclesJson) ? vehiclesJson : [];
  if (!raw.length) {
    if (process.env.NODE_ENV !== 'production') {
        console.log('📁 Archivo vehicles.local.json está vacío');
    }
    return [];
  }

  const vehicles: Vehicle[] = raw.map((v: any) => {
    const normalizedImages = normalizeImages(v);
    const primary =
      normalizedImages[0]?.url ??
      (Array.isArray(v.images) &&
        v.images.length &&
        (typeof v.images[0] === 'string' ? v.images[0] : v.images[0]?.url)) ??
      v.image ??
      null;

    return {
      ...v,
      price: v.price ?? null,
      kilometers: v.kilometers ?? null,
      image: primary,
      images: normalizedImages,
    } as Vehicle;
  });

  // Completar galería desde disco si solo hay 0-1 imágenes
  const enriched = await Promise.all(
    vehicles.map(async (v) => {
      const count = Array.isArray(v.images) ? v.images.length : 0;
      if (count <= 1 && v.image) {
        try {
          return await completeVehicleGalleryFromDisk(v);
        } catch {
          return v;
        }
      }
      return v;
    })
  );

  console.log(`✅ Cargados ${enriched.length} vehículos desde import estático`);
  return enriched;
}

/**
 * Lee los slugs desde el archivo JSON local (importación estática)
 * @returns Array de slugs o array vacío
 */
export async function getLocalSlugs(): Promise<string[]> {
  const slugs: string[] = Array.isArray(slugsJson) ? slugsJson : [];
  if (!slugs.length) {
    console.log('📁 Archivo vehicles.slugs.local.json está vacío');
    return [];
  }
  console.log(`✅ Cargados ${slugs.length} slugs desde import estático`);
  return slugs;
}

/**
 * Busca un vehículo específico por slug en los datos locales
 */
export async function getLocalVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const vehicles = await getLocalVehicles();
  const vehicle = vehicles.find(v => v.slug === slug);
  if (vehicle) {
    console.log(`✅ Vehículo encontrado localmente: ${vehicle.brand} ${vehicle.model}`);
  } else {
    console.log(`📁 Vehículo con slug "${slug}" no encontrado localmente`);
    return null;
  }

  // Completar galería desde disco si procede
  const count = Array.isArray(vehicle.images) ? vehicle.images.length : 0;
  if (count <= 1 && vehicle.image) {
    try {
      return await completeVehicleGalleryFromDisk(vehicle);
    } catch {
      return vehicle;
    }
  }
  return vehicle;
}