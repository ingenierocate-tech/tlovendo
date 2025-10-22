import fs from 'fs';
import path from 'path';
import type { Vehicle } from '@/types/vehicle';
import { fetchFotosCsv, fetchVehiculosCsv, type FotoRow, type VehiculoRow } from '@/lib/sheet-photos';
import { buildImageSet } from '@/lib/gdrive';
import { getLocalVehicles, getLocalSlugs, getLocalVehicleBySlug } from './local';

const ROOT = process.cwd();
const LOCAL_JSON = path.join(ROOT, 'src/data/vehicles.local.json');

// Funciones de utilidad para procesar datos
function parseNumber(value: string): number | null {
  if (!value || value.trim() === '') return null;
  const num = parseFloat(value.replace(/[^\d.-]/g, ''));
  return isNaN(num) ? null : num;
}

function parseBoolean(value: string): boolean {
  if (!value || value.trim() === '') return false;
  const lower = value.toLowerCase().trim();
  return lower === 'sí' || lower === 'si' || lower === 'yes' || lower === 'true' || lower === '1';
}

function processField(value: string, defaultValue: string = 'No disponible'): string {
  return value && value.trim() !== '' ? value.trim() : defaultValue;
}

function slugify(brand: string, model: string, year: string|number, version?: string) {
  const parts = [brand, model, year.toString()];
  if (version && version !== 'No disponible') parts.push(version);
  return parts.join('-').toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
}

async function fetchVehiclesFromSheet(): Promise<Vehicle[]> {
  try {
    const [vehiculosData, fotosData] = await Promise.all([
      fetchVehiculosCsv(),
      fetchFotosCsv()
    ]);

    const vehicles: Vehicle[] = [];
    let idCounter = 1;

    for (const vehiculo of vehiculosData) {
      // Saltar filas vacías
      if (!vehiculo.Marca || !vehiculo.Modelo || !vehiculo.Año) continue;

      // Buscar fotos correspondientes
      const fotos = fotosData.find(f => 
        f.Marca === vehiculo.Marca && 
        f.Modelo === vehiculo.Modelo && 
        f.Año === vehiculo.Año &&
        f.Versión === vehiculo.Versión
      );

      // Procesar imágenes en orden específico
      const imageSet = {
        lateral: fotos?.Lateral || '',
        frontal: fotos?.Frontal || '',
        posterior: fotos?.Posterior || '',
        tablero: fotos?.Tablero || '',
        asientos: fotos?.Asientos || ''
      };

      const images = buildImageSet(vehiculo.Marca, vehiculo.Modelo, parseInt(vehiculo.Año), imageSet);
      const primaryImage = images.length > 0 ? images[0].url : '/placeholder-car.webp';

      // Procesar datos numéricos
      const price = parseNumber(vehiculo.Precio);
      const kilometers = parseNumber(vehiculo.Kilometraje);
      let owners = parseNumber(vehiculo.Dueños) || 1;
      if (owners === 0) owners = 1; // Asegurar al menos 1 dueño

      const vehicle: Vehicle = {
        id: idCounter++,
        slug: slugify(vehiculo.Marca, vehiculo.Modelo, vehiculo.Año, vehiculo.Versión),
        brand: vehiculo.Marca,
        model: vehiculo.Modelo,
        version: processField(vehiculo.Versión),
        year: parseInt(vehiculo.Año) || new Date().getFullYear(),
        price: price,
        kilometers: kilometers,
        transmission: processField(vehiculo.Transmisión, 'Manual'),
        fuel: processField(vehiculo.Combustible, 'Bencina'),
        region: processField(vehiculo.Ubicación, 'No disponible'),
        image: primaryImage,
        images: images || [],
        publishedAt: new Date().toISOString().split('T')[0],
        owners: owners,
        color: processField(vehiculo.Color),
        status: processField(vehiculo.Estado),
        
        // Especificaciones técnicas
        engine: processField(vehiculo.Motor),
        power: processField(vehiculo.Potencia),
        consumption: processField(vehiculo.Consumo),
        emissions: processField(vehiculo.Emisiones),
        
        // Características de seguridad
        abs: parseBoolean(vehiculo.ABS),
        esp: parseBoolean(vehiculo.ESP),
        airbags: processField(vehiculo.Airbags),
        tractionControl: parseBoolean(vehiculo['Control de tracción']),
        
        // Características de confort
        airConditioning: parseBoolean(vehiculo['Aire acondicionado']),
        powerSteering: parseBoolean(vehiculo['Dirección asistida']),
        electricWindows: parseBoolean(vehiculo['Alzavidrios eléctricos']),
        electricMirrors: parseBoolean(vehiculo['Espejos eléctricos']),
        audioSystem: parseBoolean(vehiculo['Sistema de audio']),
        bluetooth: parseBoolean(vehiculo.Bluetooth),
        usb: parseBoolean(vehiculo.USB),
        cruiseControl: parseBoolean(vehiculo['Control crucero']),
        
        // Vínculo
        link: vehiculo.Vínculo && vehiculo.Vínculo.trim() !== '' ? vehiculo.Vínculo : undefined
      };

      vehicles.push(vehicle);
    }

    console.log(`✅ Cargados ${vehicles.length} vehículos desde Google Sheet`);
    return vehicles;
  } catch (error) {
    console.error('Error fetching vehicles from Google Sheet:', error);
    return [];
  }
}

// Función mock vacía (no se usa si hay locales o Sheet)
async function getMockVehicles(): Promise<Vehicle[]> {
  return [];
}

/**
 * Obtiene todos los vehículos con prioridad: locales → Sheet → mock vacío
 */
export async function getVehicles(): Promise<Vehicle[]> {
  console.log('🔍 getVehicles: Iniciando carga de vehículos...');
  
  // 1. Intentar cargar datos locales primero
  console.log('🔍 getVehicles: Intentando cargar datos locales...');
  const localVehicles = await getLocalVehicles();
  // En producción o con FORCE_LOCAL, usar siempre los locales
  const forceLocal = process.env.FORCE_LOCAL === '1';
  if (process.env.NODE_ENV === 'production' || forceLocal) {
    return localVehicles;
  }
  console.log(`🔍 getVehicles: Datos locales cargados: ${localVehicles.length} vehículos`);
  
  if (localVehicles.length > 0) {
    console.log('✅ getVehicles: Retornando vehículos locales');
    return localVehicles;
  }

  // 2. Fallback: cargar desde Google Sheet
  console.log('🔍 getVehicles: Intentando cargar desde Google Sheet...');
  try {
    const sheetVehicles = await fetchVehiclesFromSheet();
    console.log(`🔍 getVehicles: Datos de Sheet cargados: ${sheetVehicles.length} vehículos`);
    if (sheetVehicles.length > 0) {
      console.log('✅ getVehicles: Retornando vehículos de Sheet');
      return sheetVehicles;
    }
  } catch (error) {
    console.error('❌ getVehicles: Error cargando desde Google Sheet:', error);
  }

  // 3. Último fallback: array vacío (no usar mock)
  console.log('⚠️ getVehicles: No se encontraron vehículos en locales ni en Sheet');
  return [];
}

/**
 * Obtiene los slugs de vehículos con la misma lógica de prioridad
 */
export async function getVehicleSlugs(): Promise<string[]> {
  // 1. Intentar cargar slugs locales primero
  const localSlugs = await getLocalSlugs();
  if (localSlugs.length > 0) {
    return localSlugs;
  }

  // 2. Fallback: extraer slugs desde Sheet
  try {
    const vehicles = await fetchVehiclesFromSheet();
    return vehicles.map(v => v.slug);
  } catch (error) {
    console.error('Error obteniendo slugs desde Google Sheet:', error);
  }

  // 3. Último fallback: array vacío
  return [];
}

/**
 * Busca un vehículo específico por slug
 */
export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  // 1. Buscar en datos locales primero
  const localVehicle = await getLocalVehicleBySlug(slug);
  if (localVehicle) {
    return localVehicle;
  }

  // 2. Fallback: buscar en todos los vehículos (que ya incluye la lógica de fallback)
  const allVehicles = await getVehicles();
  return allVehicles.find(v => v.slug === slug) || null;
}