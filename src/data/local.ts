import fs from 'fs-extra';
import path from 'path';
import { Vehicle } from '@/types/vehicle';

const VEHICLES_LOCAL_PATH = path.join(process.cwd(), 'src/data/vehicles.local.json');
const SLUGS_LOCAL_PATH = path.join(process.cwd(), 'src/data/vehicles.slugs.local.json');

function sanitizeJson(raw: string): string {
  // Quitar comentarios tipo // y bloques /* ... */
  let s = raw.replace(/^\s*\/\/.*$/gm, '');
  s = s.replace(/\/\*[\s\S]*?\*\//g, '');
  // Quitar comas finales antes de cerrar objetos/arreglos
  s = s.replace(/,\s*([}\]])/g, '$1');
  return s.trim();
}

/**
 * Lee los vehículos desde el archivo JSON local
 * @returns Array de vehículos o array vacío si no existe o está vacío
 */
export async function getLocalVehicles(): Promise<Vehicle[]> {
  try {
    if (!await fs.pathExists(VEHICLES_LOCAL_PATH)) {
      console.log('📁 Archivo vehicles.local.json no encontrado');
      return [];
    }
    const fileContent = await fs.readFile(VEHICLES_LOCAL_PATH, 'utf8');
    const data = JSON.parse(sanitizeJson(fileContent));
    let vehicles: Vehicle[] = Array.isArray(data) ? data : [];
    if (vehicles.length === 0) {
      console.log('📁 Archivo vehicles.local.json está vacío');
      return [];
    }

    // Enriquecer imágenes: si un vehículo tiene 0–1 imagen en JSON,
    // completar automáticamente desde la carpeta en public/autos derivada del image principal.
    vehicles = await Promise.all(
      vehicles.map(async (v) => {
        const hasGallery = Array.isArray(v.images) && v.images.length > 1;
        const hasPrimaryImage = typeof v.image === 'string' && v.image.startsWith('/');

        // En producción (Vercel), no leer el filesystem ni armar galerías dinámicas
        const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
        if (isProd || hasGallery || !hasPrimaryImage) {
          return v;
        }

        try {
          const relImage = v.image!.replace(/^\/+/, '');
          const absImagePath = path.join(process.cwd(), 'public', relImage);
          let dirPath = path.dirname(absImagePath);

          const existsDir = await fs.pathExists(dirPath);
          if (!existsDir) {
            // Fallback mínimo y puntual: Citroen C4 Picasso 2015
            const slugToFolder: Record<string, string> = {
              'citroen-c4-picasso-2015': 'Citroen C4 Picasso 2015',
            };
            const alias = slugToFolder[v.slug];
            if (alias) {
              const fallbackDir = path.join(process.cwd(), 'public', 'autos', alias);
              if (await fs.pathExists(fallbackDir)) {
                dirPath = fallbackDir;
              } else {
                return v;
              }
            } else {
              return v;
            }
          }

          const entries = await fs.readdir(dirPath, { withFileTypes: true });
          const files = entries
            .filter((e) => e.isFile())
            .map((e) => e.name)
            .filter((name) => /\.(jpe?g|png|webp|avif|mp4)$/i.test(name))
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

          if (files.length === 0) {
            return v;
          }

          const publicRoot = path.join(process.cwd(), 'public');
          const toPublicUrl = (absPath: string) =>
            '/' + path.relative(publicRoot, absPath).split(path.sep).join('/');

          const gallery = files.map((file) => {
            const abs = path.join(dirPath, file);
            const url = toPublicUrl(abs);
            return {
              url,
              alt: `${v.brand} ${v.model} ${v.year ?? ''}`.trim(),
              isPrimary: /01[_-]?lateral/i.test(file),
            };
          });

          const primaryIndex = gallery.findIndex((g) => g.isPrimary);
          if (primaryIndex > 0) {
            const [primary] = gallery.splice(primaryIndex, 1);
            gallery.unshift(primary);
          }

          const updated: Vehicle = {
            ...v,
            image: gallery[0]?.url ?? v.image,
            images: gallery,
          };
          return updated;
        } catch (err) {
          console.warn(`⚠️ No se pudo completar galería para ${v.slug}: ${(err as Error).message}`);
          return v;
        }
      })
    );

    console.log(`✅ Cargados ${vehicles.length} vehículos desde archivo local`);
    return vehicles;
  } catch (error) {
    console.error('❌ Error leyendo vehicles.local.json:', error);
    return [];
  }
}

/**
 * Lee los slugs desde el archivo JSON local
 * @returns Array de slugs o array vacío si no existe o está vacío
 */
export async function getLocalSlugs(): Promise<string[]> {
  try {
    if (!await fs.pathExists(SLUGS_LOCAL_PATH)) {
      console.log('📁 Archivo vehicles.slugs.local.json no encontrado');
      return [];
    }
    const fileContent = await fs.readFile(SLUGS_LOCAL_PATH, 'utf8');
    const slugs: string[] = JSON.parse(sanitizeJson(fileContent));
    if (!Array.isArray(slugs) || slugs.length === 0) {
      console.log('📁 Archivo vehicles.slugs.local.json está vacío');
      return [];
    }
    console.log(`✅ Cargados ${slugs.length} slugs desde archivo local`);
    return slugs;
  } catch (error) {
    console.error('❌ Error leyendo vehicles.slugs.local.json:', error);
    return [];
  }
}

/**
 * Busca un vehículo específico por slug en los datos locales
 * @param slug Slug del vehículo a buscar
 * @returns Vehículo encontrado o null
 */
export async function getLocalVehicleBySlug(slug: string): Promise<Vehicle | null> {
  try {
    const vehicles = await getLocalVehicles();
    const vehicle = vehicles.find(v => v.slug === slug);
    
    if (vehicle) {
      console.log(`✅ Vehículo encontrado localmente: ${vehicle.brand} ${vehicle.model}`);
    } else {
      console.log(`📁 Vehículo con slug "${slug}" no encontrado localmente`);
    }
    
    return vehicle || null;
  } catch (error) {
    console.error('❌ Error buscando vehículo local:', error);
    return null;
  }
}