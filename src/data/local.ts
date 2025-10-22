import fs from 'fs-extra';
import path from 'path';
import { Vehicle } from '@/types/vehicle';

const VEHICLES_LOCAL_PATH = path.join(process.cwd(), 'src/data/vehicles.local.json');
const SLUGS_LOCAL_PATH = path.join(process.cwd(), 'src/data/vehicles.slugs.local.json');

/**
 * Lee los vehículos desde el archivo JSON local
 * @returns Array de vehículos o array vacío si no existe o está vacío
 */
export async function getLocalVehicles(): Promise<Vehicle[]> {
  // 1) Import estático: se incluye en el bundle de producción
  try {
    const mod = await import('@/data/vehicles.local.json');
    const vehicles = Array.isArray(mod.default) ? (mod.default as Vehicle[]) : [];
    if (vehicles.length > 0) {
      console.log(`✅ Cargados ${vehicles.length} vehículos desde import estático`);
      return vehicles;
    }
  } catch (_) {
    // Silenciar: si falla el import, seguimos con fs
  }

  // 2) Fallback: leer desde filesystem (útil en dev)
  try {
    const exists = await fs.pathExists(VEHICLES_LOCAL_PATH);
    if (!exists) {
      console.log('📁 Archivo vehicles.local.json no encontrado');
      return [];
    }
    const fileContent = await fs.readFile(VEHICLES_LOCAL_PATH, 'utf8');
    const data = JSON.parse(fileContent);
    const vehicles = Array.isArray(data) ? (data as Vehicle[]) : [];
    if (vehicles.length === 0) {
      console.log('📁 Archivo vehicles.local.json está vacío');
      return [];
    }
    console.log(`✅ Cargados ${vehicles.length} vehículos desde filesystem`);
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
    const staticSlugs = Array.isArray(slugsLocalJson) ? (slugsLocalJson as string[]) : [];
    if (staticSlugs.length > 0) {
        return staticSlugs;
    }
    try {
        const mod = await import('@/data/vehicles.slugs.local.json');
        const slugs = Array.isArray(mod.default) ? (mod.default as string[]) : [];
        if (slugs.length > 0) {
            console.log(`✅ Cargados ${slugs.length} slugs desde import estático`);
            return slugs;
        }
    } catch (_) {
        // Silenciar y seguir con fs
    }

    // 2) Fallback: filesystem
    try {
        const exists = await fs.pathExists(SLUGS_LOCAL_PATH);
        if (!exists) {
            console.log('📁 Archivo vehicles.slugs.local.json no encontrado');
            return [];
        }
        const fileContent = await fs.readFile(SLUGS_LOCAL_PATH, 'utf8');
        const slugs: string[] = JSON.parse(fileContent);
        if (!Array.isArray(slugs) || slugs.length === 0) {
            console.log('📁 Archivo vehicles.slugs.local.json está vacío');
            return [];
        }
        console.log(`✅ Cargados ${slugs.length} slugs desde filesystem`);
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