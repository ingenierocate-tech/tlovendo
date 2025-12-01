/* eslint-disable no-console */
const path = require('path');
const fs = require('fs-extra');
const fg = require('fast-glob');
const XLSX = require('xlsx');

/** Utilidades */
const toKebab = (s) =>
  String(s || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const toInt = (v) => {
  if (v === null || v === undefined) return undefined;
  const n = parseInt(String(v).replace(/\D+/g, ''), 10);
  return Number.isFinite(n) ? n : undefined;
};

const toPrice = (v) => {
  const n = toInt(v);
  return n && n > 0 ? n : undefined;
};

const imagesOrder = [
  { name: '01_lateral', alt: 'lateral' },
  { name: '02_frontal', alt: 'frontal' },
  { name: '03_posterior', alt: 'posterior' },
  { name: '04_tablero', alt: 'tablero' },
  { name: '05_asientos', alt: 'asientos' },
];

const IMG_EXT = ['.jpg', '.jpeg', '.png', '.webp'];

// Rutas
const EXCEL_PATH = path.join(process.cwd(), 'public/autos/catalogo.xlsx');
const AUTOS_DIR = path.join(process.cwd(), 'public/autos');
const OUTPUT_VEHICLES = path.join(process.cwd(), 'src/data/vehicles.local.json');
const OUTPUT_SLUGS = path.join(process.cwd(), 'src/data/vehicles.slugs.local.json');

/** Lee Excel por índice (la hoja "Características" viene con cabeceras "__EMPTY_*") */
function readExcelCaracteristicas(excelPath) {
  if (!fs.existsSync(excelPath)) return [];

  const wb = XLSX.readFile(excelPath);
  const sheet = wb.Sheets['Características'];
  if (!sheet) return [];

  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
  const data = [];

  // Función para convertir valores de Excel a booleanos
  const toBool = (v) => {
    if (!v || v === null || v === undefined) return false;
    const str = String(v).toLowerCase().trim();
    return str === 'sí' || str === 'si' || str === 'yes' || str === 'true' || str === '1';
  };

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i] || [];
    const marca  = r[1];
    const modelo = r[2];
    const anio   = r[3];

    if (!marca || !modelo || !anio) continue;

    const version      = r[4] ?? '';
    const duenos       = toInt(r[5]) ?? 1;
    const kilometros   = toInt(r[6]);
    const color        = r[7] ?? '';
    const transmision  = r[8] ?? '';
    const precio       = toPrice(r[9]);
    const combustible  = r[10] ?? '';
    const ubicacion    = r[11] ?? '';
    const estado       = r[12] ?? 'En venta';
    const motor        = r[13] ?? '';
    const potencia     = toInt(r[14]);
    const consumo      = r[15] ?? '';
    const emisiones    = r[16] ?? '';
    
    // Nuevos campos de características
    const abs                = toBool(r[17]);
    const esp                = toBool(r[18]);
    const airbagsFrontales   = toBool(r[19]);
    const airbagsLaterales   = toBool(r[20]);
    const controlTraccion    = toBool(r[21]);
    const aireAcondicionado  = toBool(r[22]);
    const direccionAsistida  = toBool(r[23]);
    const alzavidriosElec    = toBool(r[24]);
    const espejosElec        = toBool(r[25]);
    const sistemaAudio       = toBool(r[26]);
    const bluetooth          = toBool(r[27]);
    const usb                = toBool(r[28]);
    const controlCrucero     = toBool(r[29]);

    // Combinar airbags frontales y laterales en un string descriptivo
    let airbags = '';
    if (airbagsFrontales && airbagsLaterales) {
      airbags = 'Frontales y laterales';
    } else if (airbagsFrontales) {
      airbags = 'Frontales';
    } else if (airbagsLaterales) {
      airbags = 'Laterales';
    }

    const slug = `${toKebab(marca)}-${toKebab(modelo)}-${anio}-${toKebab(String(version))}`
      .replace(/-+/g, '-')
      .replace(/-$/, '');

    data.push({
      id: i + 1,
      slug,
      brand: String(marca).trim(),
      model: String(modelo).trim(),
      version: String(version || '').trim(),
      year: Number(anio),
      owners: duenos,
      kilometers: kilometros,
      color: String(color || '').trim(),
      transmission: String(transmision || '').trim(),
      price: precio,
      fuel: String(combustible || '').trim(),
      region: String(ubicacion || '').trim(),
      state: String(estado || '').trim(),
      engine: String(motor || '').trim(),
      power: potencia,
      consumption: String(consumo || '').trim(),
      emissions: String(emisiones || '').trim(),
      
      // Características de seguridad
      abs: abs,
      esp: esp,
      airbags: airbags || undefined,
      tractionControl: controlTraccion,
      
      // Características de confort
      airConditioning: aireAcondicionado,
      powerSteering: direccionAsistida,
      electricWindows: alzavidriosElec,
      electricMirrors: espejosElec,
      audioSystem: sistemaAudio,
      bluetooth: bluetooth,
      usb: usb,
      cruiseControl: controlCrucero,
    });
  }
  return data;
}

/** Busca imágenes para un vehículo específico */

// Mapeo de slugs problemáticos a carpetas reales
const slugToFolderMapping = {
  'chevrolet-tahoe-2018-full': 'chevrolet-tahoe-2018-lt',
  'nissan-pathfinder-2018-full': 'nissan-pathfinder-2018-advance',
  'ford-f150-xlt-2016-full': 'ford-f150-xlt-2016',
  'ford-fusion-2020-hibrido': 'ford-fusion-2020-se',
  'kia-soluto-2022-full': 'kia-soluto-2024-lx',
  // Nuevos mapeos para carpetas con espacios y acentos
  'bmw-x1-2019': 'BMW X1 2019',
  'nissan-sentra-2021': 'Nissan Sentra AT 2021',
  'citroen-c4-picasso-2015': 'Citroën C4 Picasso 2015',
  'nissan-pathfinder-33-1999': 'Nissan Pathfinder 3.3 1999'
};

async function getVehicleImages(slug) {
  // Aplicar mapeo si existe
  const actualSlug = slugToFolderMapping[slug] || slug;
  const vehicleDir = path.join(AUTOS_DIR, actualSlug);
  
  if (!await fs.pathExists(vehicleDir)) {
    return [];
  }

  try {
    // Buscar archivos de imagen en la carpeta
    const files = await fg([`${vehicleDir}/*.{jpg,jpeg,png,webp}`], {
      caseSensitiveMatch: false
    });
    
    const images = [];
    let isPrimarySet = false;

    // Procesar imágenes en orden de prioridad
    for (const imgOrder of imagesOrder) {
      const matchingFile = files.find(file => {
        const basename = path.basename(file, path.extname(file)).toLowerCase();
        return basename.includes(imgOrder.name.toLowerCase()) || 
               basename.includes(imgOrder.alt.toLowerCase());
      });

      if (matchingFile) {
        const relativePath = path.relative(path.join(process.cwd(), 'public'), matchingFile);
        images.push({
          url: `/${relativePath.replace(/\\/g, '/')}`,
          alt: `${imgOrder.alt}`,
          isPrimary: !isPrimarySet
        });
        if (!isPrimarySet) isPrimarySet = true;
      }
    }

    // Agregar imágenes restantes que no coincidan con el orden
    for (const file of files) {
      const relativePath = path.relative(path.join(process.cwd(), 'public'), file);
      const url = `/${relativePath.replace(/\\/g, '/')}`;
      
      if (!images.some(img => img.url === url)) {
        const basename = path.basename(file, path.extname(file));
        images.push({
          url,
          alt: basename,
          isPrimary: !isPrimarySet
        });
        if (!isPrimarySet) isPrimarySet = true;
      }
    }

    return images;
  } catch (error) {
    console.error(`Error al buscar imágenes para ${slug}:`, error);
    return [];
  }
}

/** Genera datos desde carpetas existentes (fallback) */
async function generateFromFolders() {
  console.log('📁 Generando datos desde carpetas existentes...');
  
  const folders = await fg([`${AUTOS_DIR}/*/`], { onlyDirectories: true });
  const vehicles = [];
  const slugs = [];
  let idCounter = 1;
  let totalImages = 0;

  for (const folder of folders) {
    const folderName = path.basename(folder);
    
    // Intentar extraer marca, modelo y año del nombre de la carpeta
    const parts = folderName.split('-');
    if (parts.length < 3) continue;
    
    const brand = parts[0];
    const model = parts[1];
    const year = parseInt(parts[2], 10);
    const version = parts.slice(3).join(' ') || '';
    
    if (!brand || !model || !year || isNaN(year)) continue;

    const slug = folderName;
    const images = await getVehicleImages(slug);
    totalImages += images.length;

    const vehicle = {
      id: idCounter++,
      slug,
      brand: brand.charAt(0).toUpperCase() + brand.slice(1),
      model: model.charAt(0).toUpperCase() + model.slice(1),
      version,
      year,
      price: null,
      kilometers: null,
      transmission: 'No disponible',
      fuel: 'No disponible',
      region: 'No disponible',
      color: 'No disponible',
      owners: 1,
      engine: 'No disponible',
      power: null,
      consumption: 'No disponible',
      emissions: 'No disponible',
      state: 'En venta',
      image: images.find(img => img.isPrimary)?.url || images[0]?.url || '/placeholder-car.webp',
      images
    };

    vehicles.push(vehicle);
    slugs.push(slug);
  }

  console.log(`✅ Generados ${vehicles.length} vehículos desde carpetas con ${totalImages} imágenes`);
  return { vehicles, slugs };
}

/** Función principal */
async function buildLocalVehicles() {
  try {
    console.log('🚗 Iniciando construcción de datos locales de vehículos...');
    
    let vehicles = [];
    let slugs = [];
    let totalImages = 0;

    // Intentar leer desde Excel primero
    if (await fs.pathExists(EXCEL_PATH)) {
      console.log('📊 Leyendo datos desde Excel...');
      const excelData = readExcelCaracteristicas(EXCEL_PATH);
      
      if (excelData.length > 0) {
        console.log(`📋 Encontrados ${excelData.length} vehículos en Excel`);
        
        // Procesar cada vehículo del Excel
        for (const vehicleData of excelData) {
          const images = await getVehicleImages(vehicleData.slug);
          totalImages += images.length;
          
          const vehicle = {
            ...vehicleData,
            image: images.find(img => img.isPrimary)?.url || images[0]?.url || '/placeholder-car.webp',
            images
          };
          
          vehicles.push(vehicle);
          slugs.push(vehicleData.slug);
        }
      } else {
        console.log('⚠️  Excel vacío o sin datos válidos, usando carpetas...');
        const folderData = await generateFromFolders();
        vehicles = folderData.vehicles;
        slugs = folderData.slugs;
        totalImages = vehicles.reduce((sum, v) => sum + v.images.length, 0);
      }
    } else {
      console.log('⚠️  Excel no encontrado, usando carpetas...');
      const folderData = await generateFromFolders();
      vehicles = folderData.vehicles;
      slugs = folderData.slugs;
      totalImages = vehicles.reduce((sum, v) => sum + v.images.length, 0);
    }

    // Crear directorios de salida si no existen
    await fs.ensureDir(path.dirname(OUTPUT_VEHICLES));
    await fs.ensureDir(path.dirname(OUTPUT_SLUGS));

    // Escribir archivos JSON
    await fs.writeJson(OUTPUT_VEHICLES, vehicles, { spaces: 2 });
    await fs.writeJson(OUTPUT_SLUGS, slugs, { spaces: 2 });

    console.log('✅ Construcción completada:');
    console.log(`   📄 ${vehicles.length} vehículos procesados`);
    console.log(`   🖼️  ${totalImages} imágenes encontradas`);
    console.log(`   💾 Archivos guardados:`);
    console.log(`      - ${OUTPUT_VEHICLES}`);
    console.log(`      - ${OUTPUT_SLUGS}`);

  } catch (error) {
    console.error('❌ Error en la construcción:', error);
    throw error;
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  buildLocalVehicles();
}

module.exports = { buildLocalVehicles };