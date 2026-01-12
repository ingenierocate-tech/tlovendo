/* eslint-disable no-console */
const path = require('path');
const fs = require('fs-extra');
const sharp = require('sharp');
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
  
  // Intentar encontrar la hoja correcta
  let sheet = wb.Sheets['Características'];
  if (!sheet) sheet = wb.Sheets['Caracteristicas']; // Sin tilde
  if (!sheet) sheet = wb.Sheets['Hoja1'];
  if (!sheet) {
    const firstSheetName = wb.SheetNames[0];
    if (firstSheetName) {
      console.log(`⚠️  Hoja 'Características' no encontrada, usando primera hoja: '${firstSheetName}'`);
      sheet = wb.Sheets[firstSheetName];
    }
  }
  
  if (!sheet) {
    console.error('❌ No se encontró ninguna hoja válida en el Excel.');
    return [];
  }

  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
  if (rows.length === 0) {
    console.error('❌ La hoja está vacía.');
    return [];
  }

  // Buscar la fila de cabeceras
  let headerRowIndex = -1;
  for (let i = 0; i < Math.min(rows.length, 20); i++) {
    const rowStr = JSON.stringify(rows[i] || []).toLowerCase();
    if (rowStr.includes('marca') && rowStr.includes('modelo')) {
      headerRowIndex = i;
      break;
    }
  }

  if (headerRowIndex === -1) {
    console.warn('⚠️ No se encontró la fila de cabeceras (Marca/Modelo) en las primeras 20 filas. Usando fila 0 por defecto.');
    headerRowIndex = 0;
  } else {
    console.log(`✅ Cabeceras encontradas en la fila ${headerRowIndex}`);
  }

  // Detectar índices de columnas dinámicamente usando la fila de cabeceras encontrada
  const headers = (rows[headerRowIndex] || []).map(h => String(h).trim().toLowerCase());
  
  const getColIdx = (names) => headers.findIndex(h => names.includes(h));

  const idx = {
    marca: getColIdx(['marca']),
    modelo: getColIdx(['modelo']),
    anio: getColIdx(['año', 'year']),
    version: getColIdx(['versión', 'version']),
    duenos: getColIdx(['dueños', 'duenos', 'owners']),
    kilometros: getColIdx(['kilometraje', 'km', 'kilometers']),
    color: getColIdx(['color']),
    transmision: getColIdx(['transmisión', 'transmision']),
    precio: getColIdx(['precio', 'price']),
    combustible: getColIdx(['combustible', 'fuel']),
    ubicacion: getColIdx(['ubicación', 'ubicacion', 'location']),
    estado: getColIdx(['estado', 'status']),
    motor: getColIdx(['motor']),
    potencia: getColIdx(['potencia', 'power']),
    consumo: getColIdx(['consumo']),
    emisiones: getColIdx(['emisiones']),
    abs: getColIdx(['abs']),
    esp: getColIdx(['esp']),
    airbagsFront: getColIdx(['airbags frontales']),
    airbagsLat: getColIdx(['airbags laterales']),
    controlTraccion: getColIdx(['control de tracción', 'control tracción']),
    aire: getColIdx(['aire acondicionado']),
    direccion: getColIdx(['dirección asistida', 'direccion asistida']),
    alzavidrios: getColIdx(['alzavidrios eléctricos', 'alzavidrios']),
    espejos: getColIdx(['espejos eléctricos', 'espejos']),
    audio: getColIdx(['sistema de audio', 'audio']),
    bluetooth: getColIdx(['bluetooth']),
    usb: getColIdx(['usb']),
    crucero: getColIdx(['control crucero', 'crucero']),
    description: getColIdx(['descripción', 'descripcion', 'description'])
  };

  const data = [];

  // Función para convertir valores de Excel a booleanos
  const toBool = (v) => {
    if (!v || v === null || v === undefined) return false;
    const str = String(v).toLowerCase().trim();
    return str === 'sí' || str === 'si' || str === 'yes' || str === 'true' || str === '1';
  };

  for (let i = headerRowIndex + 1; i < rows.length; i++) {
    const r = rows[i] || [];
    
    // Usar índices dinámicos
    const marca  = idx.marca >= 0 ? r[idx.marca] : undefined;
    const modelo = idx.modelo >= 0 ? r[idx.modelo] : undefined;
    const anio   = idx.anio >= 0 ? r[idx.anio] : undefined;

    // Skip si es cabecera o fila vacía
    if (!marca || !modelo || !anio) continue;
    
    const marcaStr = String(marca).trim();
    const modeloStr = String(modelo).trim();
    if (marcaStr === 'Marca' || modeloStr === 'Modelo') continue;

    const version      = idx.version >= 0 ? r[idx.version] ?? '' : '';
    const duenos       = idx.duenos >= 0 ? (toInt(r[idx.duenos]) ?? 1) : 1;
    const kilometros   = idx.kilometros >= 0 ? toInt(r[idx.kilometros]) : undefined;
    const color        = idx.color >= 0 ? (r[idx.color] ?? '') : '';
    const transmision  = idx.transmision >= 0 ? (r[idx.transmision] ?? '') : '';
    const precio       = idx.precio >= 0 ? toPrice(r[idx.precio]) : undefined;
    const combustible  = idx.combustible >= 0 ? (r[idx.combustible] ?? '') : '';
    const ubicacion    = idx.ubicacion >= 0 ? (r[idx.ubicacion] ?? '') : '';
    const estado       = idx.estado >= 0 ? (r[idx.estado] ?? 'En venta') : 'En venta';
    const motor        = idx.motor >= 0 ? (r[idx.motor] ?? '') : '';
    const potencia     = idx.potencia >= 0 ? toInt(r[idx.potencia]) : undefined;
    const consumo      = idx.consumo >= 0 ? (r[idx.consumo] ?? '') : '';
    const emisiones    = idx.emisiones >= 0 ? (r[idx.emisiones] ?? '') : '';
    
    // Nuevos campos de características
    const abs                = idx.abs >= 0 ? toBool(r[idx.abs]) : false;
    const esp                = idx.esp >= 0 ? toBool(r[idx.esp]) : false;
    const airbagsFrontales   = idx.airbagsFront >= 0 ? toBool(r[idx.airbagsFront]) : false;
    const airbagsLaterales   = idx.airbagsLat >= 0 ? toBool(r[idx.airbagsLat]) : false;
    const controlTraccion    = idx.controlTraccion >= 0 ? toBool(r[idx.controlTraccion]) : false;
    const aireAcondicionado  = idx.aire >= 0 ? toBool(r[idx.aire]) : false;
    const direccionAsistida  = idx.direccion >= 0 ? toBool(r[idx.direccion]) : false;
    const alzavidriosElec    = idx.alzavidrios >= 0 ? toBool(r[idx.alzavidrios]) : false;
    const espejosElec        = idx.espejos >= 0 ? toBool(r[idx.espejos]) : false;
    const sistemaAudio       = idx.audio >= 0 ? toBool(r[idx.audio]) : false;
    const bluetooth          = idx.bluetooth >= 0 ? toBool(r[idx.bluetooth]) : false;
    const usb                = idx.usb >= 0 ? toBool(r[idx.usb]) : false;
    const controlCrucero     = idx.crucero >= 0 ? toBool(r[idx.crucero]) : false;

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

    if (slug.includes('kia') && slug.includes('rio')) {
      console.log(`🔍 DEBUG SLUG KIA RIO: '${slug}' (Original: Marca=${marca}, Modelo=${modelo}, Año=${anio}, Versión=${version})`);
    }

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
      description: idx.description >= 0 ? String(r[idx.description] || '').trim() : undefined,
      
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
  'opel-corsa-2022-1-2-puretech': 'Opel-Corsa-2022-AT',
  'nissan-x-trail-2024-exclusive': 'Nissan-Xtrail-2024-Exclusive',
  'peugeot-5008-2018-1-6-bluehdi': 'Peugeot-5008-2018-full',
  'mazda-3-2016-1-6': 'Mazda-3-2016-manual',
  'chevrolet-tahoe-2018-full': 'chevrolet-tahoe-2018-lt',
  'nissan-pathfinder-2018-full': 'nissan-pathfinder-2018-advance',
  'ford-f150-xlt-2016-full': 'ford-f150-xlt-2016',
  'ford-fusion-2020-hibrido': 'ford-fusion-2020-se',
  'kia-soluto-2022-full': 'kia-soluto-2024-lx',
  'bmw-x1-2019': 'BMW X1 2019',
  'chevrolet-silverado-2024-zr2': 'Chevrolet_Silverado_ZR2_2024',
  'chevrolet-silverado-zr2-2024-full': 'Chevrolet_Silverado_ZR2_2024',
  'citroen-c4-picasso-2015': 'Citroen C4 Picasso 2015',
  'citroen-picasso-2011': 'Citroen_C3Picasso_2011',
  'kia-rio-2018-5': 'kia-rio-5-2018',
  'nissan-sentra-2021': 'Nissan Sentra AT 2021',
  'subaru-forester-2019-limited': 'Subaru_Forester_Limited_2019',
  'subaru-forester-2019-awd': 'Subaru_Forester_Limited_2019',
  'great-wall-wingle-6-elite-2017-full': 'GreatWall_Wingle6_Elite_2017',
  'nissan-pathfinder-2003': 'Nissan_Pathfinder_3.5cc_2003',
  'nissan-pathfinder-1999': 'Nissan Pathfinder 3.3 1999',
  'bmw-320i-m-sport-2024': 'Bmw_320iM_sport_2024',
  'porsche-panamera-gts-2017': 'Porsche_Panamera_GTS_2017',
  
  // Mapeos adicionales para unificar Excel (slugs cortos) con Carpetas
  'subaru-forester-2019': 'Subaru_Forester_Limited_2019',
  'ford-fusion-2020': 'ford-fusion-2020-se',
  'chevrolet-tahoe-2018': 'chevrolet-tahoe-2018-lt',
  'nissan-pathfinder-2018': 'nissan-pathfinder-2018-advance',
  'ford-f150-2016': 'ford-f150-xlt-2016',
  'great-wall-wingle-6-2017': 'GreatWall_Wingle6_Elite_2017'
};

// Override manual de precios y estados para asegurar consistencia con la visual del cliente
const manualOverrides = [
  { keywords: ['ford', 'f150', '2016'], price: 17990000, state: 'Vendido' },
  { keywords: ['toyota', 'avensis', '2013'], price: 6490000, state: 'Vendido' },
  { keywords: ['citroen', 'picasso', '2015'], price: 7790000, state: 'Vendido' },
  { keywords: ['kia', 'morning', '2024'], state: 'Vendido' },
  { keywords: ['kia', 'sonet', '2024'], state: 'Vendido' },
  { keywords: ['suzuki', 'alto', '2022'], state: 'Vendido' },
  { keywords: ['hyundai', 'tucson', '2018'], state: 'Vendido' },
  { keywords: ['kia', 'soluto', '2022'], state: 'Vendido' },
  { keywords: ['kia', 'rio', '2018'], state: 'Vendido' },
  { keywords: ['citroen', 'picasso', '2011'], state: 'Vendido' },
  { keywords: ['chevrolet', 'silverado', '2024'], price: 47990000, state: 'En venta' },
  { keywords: ['nissan', 'sentra', '2021'], price: 13750000, state: 'En venta' },
  { keywords: ['ford', 'fusion', '2020'], price: 15550000, state: 'En venta' },
  { keywords: ['subaru', 'forester', '2019'], price: 18990000, state: 'En venta' },
  { keywords: ['bmw', 'x1', '2019'], price: 16890000, state: 'En venta' },
  { keywords: ['chevrolet', 'tahoe', '2018'], price: 23990000, state: 'En venta' },
  { keywords: ['nissan', 'pathfinder', '2018'], price: 17550000, state: 'En venta' },
  { keywords: ['great', 'wall', 'wingle', '2017'], price: 6990000, state: 'En venta' },
  { keywords: ['mercedes', 'glc', '2016'], price: 17890000, state: 'En venta' },
  { keywords: ['nissan', 'pathfinder', '2003'], price: 10500000, state: 'En venta' },
  { keywords: ['nissan', 'pathfinder', '1999'], price: 9750000, state: 'En venta' }
];

function applyManualOverrides(vehicles) {
  console.log('🔧 Aplicando overrides manuales y deduplicación estricta...');
  let appliedCount = 0;
  
  // Reset keep flag
  // vehicles.forEach(v => v.keep = false); // DESACTIVADO: Para evitar ocultar vehículos no listados

  // Marcar históricos como keep=true por defecto (se manejarán aparte si hay conflictos, pero son únicos por definición aquí)
  vehicles.filter(v => v.slug === 'bmw-320i-m-sport-2024' || v.slug === 'porsche-panamera-gts-2017').forEach(v => v.keep = true);

  for (const override of manualOverrides) {
    // Encontrar todos los candidatos que coincidan con este override
    const candidates = vehicles.filter(v => {
      const slug = v.slug.toLowerCase();
      // Verificar coincidencia de keywords
      if (!override.keywords.every(k => slug.includes(k))) return false;
      
      // Prevención de falsos positivos específicos
      if (slug.includes('citroen') && slug.includes('picasso')) {
        if (override.keywords.includes('2015') && !slug.includes('2015')) return false;
      }
      return true;
    });

    if (candidates.length === 0) {
      console.warn(`⚠️ No se encontró vehículo para: ${override.keywords.join(' ')}`);
      continue;
    }

    // Elegir el mejor candidato (priorizar el que tenga imágenes, o el que venga del Excel)
    // Asumimos que si tiene ID < 1000 viene del Excel/Folder procesado primero
    candidates.sort((a, b) => {
      const aImages = (a.images || []).length;
      const bImages = (b.images || []).length;
      if (aImages !== bImages) return bImages - aImages; // Más imágenes primero
      return a.id - b.id; // Menor ID primero
    });

    const bestMatch = candidates[0];
    
    // Aplicar override al ganador
    if (override.price !== undefined) bestMatch.price = override.price;
    if (override.state !== undefined) bestMatch.state = override.state;
    
    bestMatch.keep = true;
    appliedCount++;
    
    // Log para depuración
    // console.log(`✅ Match para ${override.keywords.join(' ')} -> ${bestMatch.slug}`);
  }
  
  console.log(`✅ Se aseguraron ${appliedCount} vehículos únicos de la lista prioritaria.`);
}

// Vehículos vendidos históricos que no están en el Excel actual
const historicalSoldVehicles = [
  {
    "id": 1001,
    "slug": "bmw-320i-m-sport-2024",
    "brand": "BMW",
    "model": "320i M Sport",
    "version": "G20",
    "year": 2024,
    "owners": 1,
    "kilometers": null,
    "color": "No disponible",
    "transmission": "Automático",
    "price": null,
    "fuel": "Bencina",
    "region": "Santiago",
    "state": "Vendido",
    "image": "/autos/Bmw_320iM_sport_2024/01_lateral.jpg",
    "images": [
      "/autos/Bmw_320iM_sport_2024/01_lateral.jpg"
    ]
  },
  {
    "id": 1002,
    "slug": "porsche-panamera-gts-2017",
    "brand": "Porsche",
    "model": "Panamera GTS",
    "version": "",
    "year": 2017,
    "owners": 1,
    "kilometers": null,
    "color": "No disponible",
    "transmission": "Automático",
    "price": null,
    "fuel": "Bencina",
    "region": "Santiago",
    "state": "Vendido",
    "image": "/autos/Porsche_Panamera_GTS_2017/01_lateral.jpg",
    "images": [
      "/autos/Porsche_Panamera_GTS_2017/01_lateral.jpg"
    ]
  }
];

// Mapeo inverso: carpeta -> slug normalizado (Debe coincidir con el slug generado por Excel)
const folderToSlugMapping = {
  'Bmw_320iM_sport_2024': 'bmw-320i-m-sport-2024',
  'Porsche_Panamera_GTS_2017': 'porsche-panamera-gts-2017',
  'Chevrolet_Silverado_ZR2_2024': 'chevrolet-silverado-zr2-2024-full',
  'Subaru_Forester_Limited_2019': 'subaru-forester-2019-awd',
  'kia-soluto-2024-lx': 'kia-soluto-2022-full',
  'Citroen_C3Picasso_2011': 'citroen-picasso-2011',
  'kia-rio-5-2018': 'kia-rio-2018-5',
  
  // Mapeos inversos para unificar duplicados
  'ford-fusion-2020-se': 'ford-fusion-2020-hibrido',
  'chevrolet-tahoe-2018-lt': 'chevrolet-tahoe-2018-full',
  'nissan-pathfinder-2018-advance': 'nissan-pathfinder-2018-full',
  'GreatWall_Wingle6_Elite_2017': 'great-wall-wingle-6-elite-2017-full',
  'ford-f150-xlt-2016': 'ford-f150-xlt-2016-full',
  'Nissan_Pathfinder_3.5cc_2003': 'nissan-pathfinder-2003',
  'Nissan Pathfinder 3.3 1999': 'nissan-pathfinder-1999',
  'Nissan Sentra AT 2021': 'nissan-sentra-2021',
  'BMW X1 2019': 'bmw-x1-2019',
  'Citroen C4 Picasso 2015': 'citroen-c4-picasso-2015',
  
  // Nuevos mapeos para evitar duplicados (Folder vs Chat Manual)
  'Opel-Corsa-2022-AT': 'opel-corsa-2022-1-2-puretech',
  'Nissan-Xtrail-2024-Exclusive': 'nissan-x-trail-2024-exclusive',
  'Peugeot-5008-2018-full': 'peugeot-5008-2018-1-6-bluehdi',
  'Mazda-3-2016-manual': 'mazda-3-2016-1-6'
};

async function getVehicleImages(slug) {
  // Aplicar mapeo si existe
  const actualSlug = slugToFolderMapping[slug] || slug;
  const vehicleDir = path.join(AUTOS_DIR, actualSlug);
  
  if (!await fs.pathExists(vehicleDir)) {
    return [];
  }

  try {
    // Buscar archivos de imagen en la carpeta usando fs.readdir para mayor robustez
    // (fast-glob a veces falla con espacios o caracteres especiales en rutas absolutas)
    const allFiles = await fs.readdir(vehicleDir);
    const files = allFiles
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map(file => path.join(vehicleDir, file));
    
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
  
  // Usar fs.readdir en lugar de fast-glob
  const dirents = await fs.readdir(AUTOS_DIR, { withFileTypes: true });
  const folders = dirents
    .filter(dirent => dirent.isDirectory())
    .map(dirent => path.join(AUTOS_DIR, dirent.name));

  const vehicles = [];
  const slugs = [];
  let idCounter = 1;
  let totalImages = 0;

  for (const folder of folders) {
    let folderName = path.basename(folder).trim();
    
    console.log(`📂 Procesando carpeta: '${folderName}'`);
    
    // Intentar extraer marca, modelo y año usando slug normalizado si existe
    // Búsqueda robusta en el mapa
    let raw = folderToSlugMapping[folderName];
    
    if (!raw) {
      // Intentar búsqueda insensible a mayúsculas/espacios
      const matchingKey = Object.keys(folderToSlugMapping).find(k => k.toLowerCase().trim() === folderName.toLowerCase());
      if (matchingKey) {
        raw = folderToSlugMapping[matchingKey];
        console.log(`   ✅ Match flexible encontrado: '${folderName}' -> '${raw}'`);
      }
    }
    
    if (!raw) {
      console.log(`   ⚠️ No hay mapeo para '${folderName}', usando nombre original como slug.`);
      raw = folderName;
    } else {
      console.log(`   🎯 Mapeado a slug: '${raw}'`);
    }

    const parts = raw.split('-');
    if (parts.length < 3) continue;
    
    const brand = parts[0];
    const model = parts[1];
    const year = parseInt(parts[2], 10);
    const version = parts.slice(3).join(' ') || '';
    
    if (!brand || !model || !year || isNaN(year)) continue;

    const slug = raw;
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
        
        // Merge opcional desde carpetas para añadir faltantes (vendidos, etc.)
        if (process.env.INCLUDE_FOLDERS !== '0') {
          const folderData = await generateFromFolders();
          const seen = new Set(slugs);
          for (const v of folderData.vehicles) {
            if (!seen.has(v.slug)) {
              vehicles.push(v);
              slugs.push(v.slug);
              totalImages += Array.isArray(v.images) ? v.images.length : 0;
            }
          }
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

    // Agregar vehículos manuales desde el chat (bypass Excel)
    const chatVehicles = [
      {
        slug: 'opel-corsa-2022-1-2-puretech',
        brand: 'Opel', model: 'Corsa', year: 2022, version: '1.2 PureTech',
        transmission: 'Automática', fuel: 'Bencina', kilometers: 61000,
        price: 9350000, owners: 1, state: 'En venta',
        description: `✔️ Motor 1.2 bencinero, muy económico 
✔️ Caja automática cómoda y suave 
✔️ Mantención recién hecha 
✔️ Ideal para ciudad y uso diario 
✔️ Pantalla con Apple CarPlay / Android Auto 
✔️ Control de estabilidad, airbags, ISOFIX 
✔️ Interior cómodo y bien cuidado 
✔️ Manejo ágil, fácil de estacionar 
📄 Documentación al día, listo para transferir 
💳 Financiamiento disponible 
🔁 Recibo vehículo menor en parte de pago 
📲 Interesados reales, escribir por interno`,
        abs: true, esp: true, airbags: 'Frontales y laterales', airConditioning: true,
        bluetooth: true, usb: true, electricWindows: true, electricMirrors: true
      },
      {
        slug: 'nissan-x-trail-2024-exclusive',
        brand: 'Nissan', model: 'X-Trail', year: 2024, version: 'Exclusive',
        transmission: 'Automática', fuel: 'Bencina', kilometers: 3000,
        price: 27890000, owners: 1, state: 'En venta',
        description: `✔️ Prácticamente nueva 
✔️ Motor 2.5 bencinero + caja CVT 
✔️ Full seguridad (frenado, carril, punto ciego, crucero inteligente) 
✔️ Asientos de cuero eléctricos y calefaccionados 
✔️ Pantalla grande + CarPlay / Android Auto 
✔️ Panel digital + HUD 
✔️ Climatizador triple zona 
✔️ Cargador inalámbrico 
✔️ Nunca chocado 
📄 Documentación al día, lista para transferir 
💳 Financiamiento disponible 
🔁 Recibo vehículo menor en parte de pago 
📲 Interesados reales, escribir por interno`,
        abs: true, esp: true, airbags: 'Frontales y laterales', airConditioning: true,
        bluetooth: true, usb: true, electricWindows: true, electricMirrors: true,
        cruiseControl: true, tractionControl: true, audioSystem: true
      },
      {
        slug: 'peugeot-5008-2018-1-6-bluehdi',
        brand: 'Peugeot', model: '5008', year: 2018, version: '1.6 BlueHDi',
        transmission: 'Automática', fuel: 'Diésel', kilometers: 113000,
        price: 15890000, owners: 2, state: 'En venta',
        description: `✔️ Motor diésel 1.6 BlueHDi — económico y con torque ideal para SUV familiar (bajo consumo por su tipo de motor). 
✔️ Caja automática — conducción cómoda en ciudad y carretera. 
✔️ SUV 7 plazas — ideal para familia o viajes con espacio para todos. 
✔️ Buen espacio de maletero (~780 L) — alto espacio para carga y bagaje. 
✔️ Seguridad completa — control de estabilidad, ABS, airbags, ISOFIX. 
✔️ Conectividad moderna — pantalla con Apple CarPlay / Android Auto. 
✔️ Interior cómodo y amplio, ideal para trayectos largos y familia. 
✔️ Muy buen rendimiento diésel — bajo consumo en ruta y ciudad. 
📄 Documentación al día, listo para transferir 
💳 Financiamiento disponible 
🔁 Recibo vehículo menor en parte de pago 
📲 Interesados reales, escribir por interno`,
        abs: true, esp: true, airbags: 'Frontales y laterales', airConditioning: true,
        bluetooth: true, usb: true, electricWindows: true, electricMirrors: true,
        cruiseControl: true
      },
      {
        slug: 'mazda-3-2016-1-6',
        brand: 'Mazda', model: '3', year: 2016, version: '1.6',
        transmission: 'Manual', fuel: 'Bencina', kilometers: 76000,
        price: 8890000, owners: 1, state: 'En venta',
        description: `✔️ Motor 1.6 bencinero, económico y confiable 
✔️ Caja mecánica suave y rendidora 
✔️ Solo 76.000 km 
✔️ Color blanco 
✔️ Muy buen estado general 
✔️ Nunca chocado 
✔️ Mantenciones al día 
✔️ Interior cómodo y bien cuidado 
✔️ Ideal para ciudad, viajes o aplicaciones 
⛽ Consumo aprox. 15–16 km/l mixto 
📄 Documentación al día, listo para transferir 
💳 Financiamiento disponible 
🔁 Recibo vehículo en parte de pago 
📲 Interesados reales, escribir por interno.`,
        abs: true, airbags: 'Frontales', airConditioning: true, electricWindows: true, audioSystem: true
      },
      {
        slug: 'nissan-pathfinder-1999',
        brand: 'Nissan', model: 'Pathfinder', year: 1999, version: '3.3 V6 Tope de Línea',
        transmission: 'Automática', fuel: 'Bencina', kilometers: 184000,
        price: 9750000, owners: 2, state: 'En venta', region: 'Viña del Mar',
        description: `✨ ¡Oportunidad! Pathfinder en excelente condición, cuidada y lista para seguir rodando! 
🔥 Características destacadas:
⬆️ Levante de 2” — presencia más robusta y mejor despeje. 
🧳 Parrilla instalada — ideal para viajes y carga adicional. 
🪑 Interior tope de línea — cómodo y acogedor. 
🚘 Automática — suave y fácil de manejar. 
💪 Motor 3.3 V6 confiable y con muy buen desempeño. 
🚙 Carrocería e interior en excelente estado para su año. 
🚫 Nunca chocada — estructura 100% íntegra. 
📦 Segundo dueño — muy bien cuidada. 
👉 Ideal para: Quien busca un SUV amplio, potente y cómodo. Viajes, ciudad, familia o escapadas fuera del camino.`,
        abs: true, airConditioning: true, electricWindows: true, audioSystem: true, electricMirrors: true,
        airbags: 'Frontales', tractionControl: false, cruiseControl: true
      },
      {
        slug: 'nissan-sentra-2021',
        brand: 'Nissan', model: 'Sentra', year: 2021, version: 'Advance CVT',
        transmission: 'Automática', fuel: 'Bencina', kilometers: 75000,
        price: 13750000, owners: 1, state: 'En venta', region: 'Viña del Mar',
        description: `✨ ¡Oportunidad! Sentra moderno, económico, seguro y muy confortable. ¡Listo para llegar y manejar!
🔥 Características destacadas:
🛠️ Motor 2.0 con excelente rendimiento — ágil, suave y económico (hasta ~15 km/l mixto).
🎛️ Caja automática CVT — conducción fluida y muy cómoda en ciudad o carretera.
📱 Pantalla táctil con Apple CarPlay / Android Auto — conectividad total.
🛡️ Seguridad avanzada — alerta de punto ciego, asistente de carril y frenado de emergencia.
🪑 Interior amplio y ergonómico — asientos “Zero Gravity” muy cómodos.
🚘 Estabilidad sobresaliente — suspensión multibrazo que mejora agarre y confort.
🚫 Nunca chocado — estructura íntegra.
📦 Mantenciones al día — muy bien cuidado.
👉 Ideal para: Quien busca un sedán moderno, seguro y muy económico. Uso diario, viajes, familia, app tipo Uber/Beat/Didi, o como auto de inversión.
Consulte por financiamiento automotriz, recibimos vehículo de menor valor.`,
        abs: true, esp: true, airbags: 'Frontales y laterales', airConditioning: true,
        bluetooth: true, usb: true, electricWindows: true, electricMirrors: true,
        cruiseControl: true, tractionControl: true, audioSystem: true
      },
      {
        slug: 'bmw-x1-2019',
        brand: 'BMW', model: 'X1', year: 2019, version: 'sDrive 20i TwinPower Turbo',
        transmission: 'Automática', fuel: 'Bencina', kilometers: 80000,
        price: 16890000, owners: 1, state: 'En venta', region: 'Peñalolén',
        description: `✨ Versión sDrive 20i / Motor 2.0 TwinPower Turbo 
✅ Único dueño 
✅ Mantenciones 100% en concesionario oficial BMW 👨‍🔧 
✅ Transmisión automática 
✅ Pantalla iDrive + Bluetooth + comandos al volante 
✅ Sensores de retroceso + cámara trasera 📹 
✅ Modo de manejo ECO / Comfort / Sport 
✅ Airbags múltiples + control de estabilidad 
✅ Llantas de aleación + luces LED 

🧾 Excelente estado, uso particular, interior y exterior muy cuidados. 
🚗 SUV premium, cómodo, firme y muy eficiente para ciudad y carretera. 

📍 Ubicación: Peñalolén 
📞 Contáctame por mensaje o WhatsApp para coordinar visita o envío de más fotos.`,
        abs: true, esp: true, airbags: 'Frontales, laterales y cortina', airConditioning: true,
        bluetooth: true, usb: true, electricWindows: true, electricMirrors: true,
        cruiseControl: true, tractionControl: true, audioSystem: true,
        parkingSensors: true, rearCamera: true, ledLights: true, alloyWheels: true
      }
    ];

    for (const cv of chatVehicles) {
      console.log(`🚙 Inyectando vehículo manual: ${cv.slug}`);
      
      // Eliminar versión automática previa si existe para asegurar que manda la manual
      const existingIdx = vehicles.findIndex(v => v.slug === cv.slug);
      if (existingIdx !== -1) {
        console.log(`   🗑️ Reemplazando datos automáticos por manuales para: ${cv.slug}`);
        vehicles.splice(existingIdx, 1);
      }

      try {
        // Forzar búsqueda por slug mapeado o directo
        const folderName = slugToFolderMapping[cv.slug] || cv.slug;
        const images = await getVehicleImages(cv.slug);
        
        cv.images = images;
        // Prioridad absoluta a 01_lateral para la foto principal del catálogo
        const primary = images.find(img => img.url.toLowerCase().includes('01_lateral')) || images[0];
        cv.image = primary ? primary.url : '/placeholder-car.webp';
        
        if (images.length === 0) {
          console.warn(`⚠️ No se encontraron imágenes en la carpeta: ${folderName}`);
        } else {
          console.log(`   📸 ${images.length} imágenes cargadas para ${cv.brand} ${cv.model}`);
        }
      } catch (err) {
        console.warn(`⚠️ Error cargando imágenes para ${cv.slug}: ${err.message}`);
        cv.images = [];
        cv.image = '/placeholder-car.webp';
      }
      vehicles.push(cv);
      slugs.push(cv.slug);
      totalImages += cv.images.length;
    }

    // Agregar vehículos históricos vendidos
    for (const hv of historicalSoldVehicles) {
      // Verificar si ya existe para no duplicar
      if (!vehicles.find(v => v.slug === hv.slug)) {
        // Actualizar imágenes del histórico usando la lógica actual
        const images = await getVehicleImages(hv.slug);
        hv.images = images;
        if (images.length > 0) {
          hv.image = images.find(img => img.isPrimary)?.url || images[0].url;
        } else {
          hv.image = '/placeholder-car.webp';
        }
        // hv.keep = true; // Se maneja en applyManualOverrides o se fuerza aquí si no está en la lista manual
        // Pero como los históricos NO están en manualOverrides, los forzamos a keep=true
        hv.keep = true; 
        
        vehicles.push(hv);
        if (!slugs.includes(hv.slug)) slugs.push(hv.slug);
        totalImages += images.length;
      }
    }

    // Aplicar overrides manuales al final para asegurar consistencia
    applyManualOverrides(vehicles);

    // Filtrar vehículos que no deben mostrarse (aquellos que no coinciden con la lista aprobada)
    const originalCount = vehicles.length;
    // vehicles = vehicles.filter(v => v.keep === true); // DESACTIVADO: Mostrar todos los vehículos encontrados
    console.log(`ℹ️ Filtro estricto desactivado. Se mantienen los ${vehicles.length} vehículos encontrados.`);
    // console.log(`🧹 Filtrados ${originalCount - vehicles.length} vehículos no aprobados. Quedan ${vehicles.length}.`);

    // Deduplicar por slug final (Normalizando string)
    const uniqueVehicles = [];
    const seenSlugs = new Set();
    for (const v of vehicles) {
      const normalizedSlug = String(v.slug || '').trim();
      if (!normalizedSlug) continue;

      if (!seenSlugs.has(normalizedSlug)) {
        seenSlugs.add(normalizedSlug);
        v.slug = normalizedSlug; // Asegurar slug limpio
        uniqueVehicles.push(v);
      } else {
        // Si el duplicado tiene imágenes y el original no, reemplazar
        // Esto ayuda si el orden de carga fue desfavorable
        const existingIdx = uniqueVehicles.findIndex(uv => uv.slug === normalizedSlug);
        if (existingIdx >= 0) {
           const existing = uniqueVehicles[existingIdx];
           const existingHasImages = existing.images && existing.images.length > 0;
           const newHasImages = v.images && v.images.length > 0;
           const existingHasPrice = existing.price !== null && existing.price !== undefined;
           const newHasPrice = v.price !== null && v.price !== undefined;
           
           // Criterio de mejora: El nuevo tiene fotos y el viejo no, O el nuevo tiene precio y el viejo no.
           // Esto asegura que la inyección manual (con precio) sobreescriba al folder automático (sin precio).
           if ((!existingHasImages && newHasImages) || (!existingHasPrice && newHasPrice)) {
             console.log(`🔄 Mejorando vehículo existente (Price/Img): ${normalizedSlug}`);
             v.slug = normalizedSlug;
             
             // Preservar datos del viejo si el nuevo está incompleto (Caso Excel -> Folder)
             if (existingHasPrice && !newHasPrice) v.price = existing.price;
             if (existing.year && !v.year) v.year = existing.year;
             if (existing.description && (!v.description || v.description.length < 10)) v.description = existing.description;
             
             uniqueVehicles[existingIdx] = v;
           } else {
             console.log(`⚠️  Eliminando duplicado redundante: ${normalizedSlug}`);
           }
        }
      }
    }
    vehicles = uniqueVehicles;

    // ---------------------------------------------------------
    // FILTRO MANUAL DE OCULTOS (No borrar, solo ocultar)
    // ---------------------------------------------------------
    const hiddenSlugs = [
      'chevrolet-silverado-zr2-2024-full'
    ];
    
    if (hiddenSlugs.length > 0) {
      const initialCount = vehicles.length;
      vehicles = vehicles.filter(v => !hiddenSlugs.includes(v.slug));
      console.log(`🙈 Se ocultaron ${initialCount - vehicles.length} vehículos (Silverado, etc).`);
    }

    // RE-INDEXAR IDs para asegurar unicidad
    vehicles.forEach((v, index) => {
      v.id = index + 1;
    });

    console.log('🔄 Iniciando optimización de imágenes (Limpieza + WebP)...');
    let deletedCount = 0;
    let convertedCount = 0;
    
    const targetSlugsForResize = [
      'opel-corsa-2022-1-2-puretech',
      'nissan-x-trail-2024-exclusive',
      'peugeot-5008-2018-1-6-bluehdi',
      'mazda-3-2016-1-6'
    ];

    for (const v of vehicles) {
      // 1. Limpieza de vendidos: Quedarse solo con la principal
      if (v.state === 'Vendido' && v.images && v.images.length > 1) {
        const primaryUrl = v.image;
        const imagesToKeep = [];
        const imagesToDelete = [];
        
        for (const img of v.images) {
          if (img.url === primaryUrl) {
            imagesToKeep.push(img);
          } else {
            imagesToDelete.push(img);
          }
        }
        
        // Fallback si no encuentra principal
        if (imagesToKeep.length === 0 && v.images.length > 0) {
           imagesToKeep.push(v.images[0]);
           const idx = imagesToDelete.indexOf(v.images[0]);
           if (idx > -1) imagesToDelete.splice(idx, 1);
        }

        if (imagesToKeep.length > 0) {
          for (const img of imagesToDelete) {
            try {
              const relativePath = img.url.startsWith('/') ? img.url.slice(1) : img.url;
              const absolutePath = path.join(process.cwd(), 'public', relativePath);
              if (await fs.pathExists(absolutePath)) {
                await fs.remove(absolutePath);
                deletedCount++;
              }
            } catch (err) { console.error(`❌ Error borrando ${img.url}:`, err); }
          }
          v.images = imagesToKeep;
        }
      }

      // 2. Conversión a WebP y Redimensionado selectivo (Optimización)
      const newImages = [];
      const shouldResize = targetSlugsForResize.includes(v.slug);

      for (const img of v.images) {
        try {
          const relativePath = img.url.startsWith('/') ? img.url.slice(1) : img.url;
          const absolutePath = path.join(process.cwd(), 'public', relativePath);
          
          if (!await fs.pathExists(absolutePath)) {
            newImages.push(img);
            continue;
          }

          const isWebP = img.url.toLowerCase().endsWith('.webp');

          // Caso 1: Es de los nuevos -> Forzar resize a 1024px y calidad 75 (aunque sea WebP)
          if (shouldResize) {
            const buffer = await fs.readFile(absolutePath);
            const webpPath = absolutePath.replace(/\.(jpg|jpeg|png|webp)$/i, '.webp');
            
            await sharp(buffer)
              .resize(1024, null, { withoutEnlargement: true }) // Max width 1024px
              .webp({ quality: 75 }) // Mayor compresión
              .toFile(webpPath);
            
            // Si cambió la extensión (ej. era jpg), borrar original y actualizar URL
            if (!isWebP) {
              await fs.remove(absolutePath);
              img.url = img.url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
              convertedCount++;
            }
          } 
          // Caso 2: No es de los nuevos y NO es WebP -> Convertir estándar
          else if (!isWebP) {
            const webpPath = absolutePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            await sharp(absolutePath)
              .webp({ quality: 80 })
              .toFile(webpPath);
            await fs.remove(absolutePath);
            img.url = img.url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            convertedCount++;
          }
          // Caso 3: Ya es WebP y no es de los nuevos -> Dejar tal cual
          
        } catch (err) {
          console.error(`❌ Error procesando ${img.url}:`, err);
        }
        newImages.push(img);
      }
      v.images = newImages;

      // Actualizar referencia de imagen principal
      if (v.image && !v.image.toLowerCase().endsWith('.webp')) {
         v.image = v.image.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      }
    }
    console.log(`✅ Optimización: ${deletedCount} fotos eliminadas, ${convertedCount} convertidas a WebP.`);

    slugs = vehicles.map(v => v.slug);

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