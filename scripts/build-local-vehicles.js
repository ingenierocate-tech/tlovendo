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
  'nissan-x-trail-2024-exclusive': 'Nissan-Xtrail-2024',
  'peugeot-5008-2018-1-6-bluehdi': 'Peugeot-5008-2018',
  'mazda-3-2016-1-6': 'Mazda-3-2016-manual',
  'chevrolet-tahoe-2018-full': 'chevrolet-tahoe-2018-lt',
  'nissan-pathfinder-2018-full': 'nissan-pathfinder-2018-advance',
  'ford-f150-xlt-2016-full': 'ford-f150-xlt-2016',
  'ford-fusion-2020-hibrido': 'ford-fusion-2020-se',
  'kia-soluto-2022-full': 'kia-soluto-2024-lx',
  'bmw-x1-2019': 'BMW X1 2019',
  'bmw-320d-2018-sport': 'Bmw_320iM_sport_2018',
  'chevrolet-silverado-2024-zr2': 'Chevrolet_Silverado_ZR2_2024',
  'chevrolet-silverado-zr2-2024-full': 'Chevrolet_Silverado_ZR2_2024',
  'citroen-c4-picasso-2015': 'Citroën C4 Picasso 2015',
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
  'great-wall-wingle-6-2017': 'GreatWall_Wingle6_Elite_2017',

  // Nuevos autos agregados por chat
  'jeep-compass-2011': 'Jeep-Compass-2011',
  'chevrolet-d-max-2017': 'Chevrolet-Dmax-2017',
  'mercedes-benz-a200-sedan-2021-look-amg': 'Marcedes Benz-A200-sedan',
  'peugeot-3008-2017': 'Peugeot-3008-2017',
  'fiat-uno-way-2020': 'Fiat-Uno-2020',
  'kia-rio-5-2020': 'Kia-rio-2020',
  // BMW 118i Look M 2024
  'bmw-118i-look-m-2024': 'BMW-118i Look-2024',
  'chevrolet-captiva-2020': 'Chevrolet_Captiva_2020',
  'toyota-raize-2025': 'Toyora_Raize_2025',
  'ford-territory-2023': 'Ford_Territory_2023',
  'hyundai-porter-2023': 'Hyundai_Porter_2023',
  'toyota-land-cruiser-2010': 'Toyota_ Landcruiser_2010',
  'subaru-crosstrek-2025': 'Subaru_crosstrek _2025',
  'mitsubishi-l200-katana-2013': 'Mitsubishi_L200Katana_2013',
  'chevrolet-silverado-zr2-2024-full': 'Chevrolet_ Silverado_2024',
  'suzuki-alto-800-2018': 'Suzuki alto 800 2018',
  'ford-explorer-limited-2018': 'Ford Explorer Límites 2018',
  'chery-iq-2014': 'Chery IQ 2014',
  'chevrolet-tracker-lt-2018': 'Chevrolet Tracker 2018',
  'mazda-2-gt-2015': 'Mazda 2 GT 2015',
  'toyota-yaris-sedan-2022': 'Toyota Yaris 2022',
  'kia-seltos-2023': 'Kia Seltos 2023',
  'chevrolet-sail-ltz-2024': 'Chevrolet Sail 2024',
  'ford-fiesta-sedan-2017': 'Ford Fiesta 2017',
  'ds-7-rivoli-2021': 'Ds7 2021',
  'bmw-316i-2016': 'BMW 316i 2016',
  'suzuki-grand-nomade-glx-2014': 'Suzuki GN 2014',
  'chevrolet-colorado-ltz-2021': 'Chevrolet LTZ 2021',
};

// Override manual de precios y estados para asegurar consistencia con la visual del cliente
const manualOverrides = [
  { keywords: ['ford', 'f150', '2016'], price: 17990000, state: 'Vendido' },
  { keywords: ['toyota', 'avensis', '2013'], price: 6490000, state: 'Vendido' },
  { keywords: ['citroen', 'picasso', '2015'], price: 7390000, state: 'En venta' },
  { keywords: ['kia', 'morning', '2024'], state: 'Vendido' },
  { keywords: ['kia', 'sonet', '2024'], state: 'Vendido' },
  { keywords: ['suzuki', 'alto', '2022'], state: 'Vendido' },
  { keywords: ['hyundai', 'tucson', '2018'], state: 'Vendido' },
  { keywords: ['kia', 'soluto', '2022'], state: 'Vendido' },
  { keywords: ['kia', 'rio', '2018'], state: 'Vendido' },
  { keywords: ['citroen', 'picasso', '2011'], state: 'Vendido' },
  { keywords: ['bmw', '320i', '2024'], state: 'Vendido' },
  { keywords: ['bmw', '320d', '2018'], price: 18990000, state: 'En venta' },
  { keywords: ['porsche', 'panamera', '2017'], state: 'Vendido' },
  { keywords: ['chevrolet', 'silverado', '2024'], price: 40590000, state: 'En venta' },
  { keywords: ['nissan', 'sentra', '2021'], price: 13750000, state: 'Vendido' },
  { keywords: ['ford', 'fusion', '2020'], price: 15550000, state: 'En venta' },
  { keywords: ['subaru', 'forester', '2019'], price: 18990000, state: 'Vendido' },
  { keywords: ['bmw', 'x1', '2019'], price: 16890000, state: 'Vendido' },
  { keywords: ['chevrolet', 'tahoe', '2018'], price: 23990000, state: 'En venta' },
  { keywords: ['nissan', 'pathfinder', '2018'], price: 17550000, state: 'Vendido' },
  { keywords: ['great', 'wall', 'wingle', '2017'], price: 6990000, state: 'Vendido' },
  { keywords: ['mercedes', 'glc', '2016'], price: 17890000, state: 'Vendido' },
  { keywords: ['mazda', '3', '2016'], price: 8890000, state: 'Vendido' },
  { keywords: ['jeep', 'compass', '2011'], price: 9350000, state: 'Vendido' },
  { keywords: ['nissan', 'pathfinder', '2003'], price: 10500000, state: 'En venta' },
  { keywords: ['nissan', 'pathfinder', '1999'], price: 9750000, state: 'En venta' },
  { keywords: ['kia', 'rio', '2020'], price: 9150000, state: 'En venta' },
  { keywords: ['fiat', 'uno', '2020'], price: 6190000, state: 'Vendido' },
  { keywords: ['toyota', 'land', '2010'], price: 11990000, state: 'Vendido' },
  { keywords: ['toyota', 'raize', '2025'], price: 11890000, state: 'Vendido' },
  { keywords: ['mitsubishi', 'l200', '2013'], price: 10390000, state: 'Vendido' },
  { keywords: ['suzuki', 'alto', '2018'], price: 3390000, state: 'Vendido' },
  { keywords: ['chery', 'iq', '2014'], price: 2550000, state: 'Vendido' },
  { keywords: ['mercedes', 'a200', '2021'], state: 'Vendido' }
];

function applyManualOverrides(vehicles) {
  console.log('🔧 Aplicando overrides manuales y deduplicación estricta...');
  let appliedCount = 0;
  
  // Reset keep flag
  // vehicles.forEach(v => v.keep = false); // DESACTIVADO: Para evitar ocultar vehículos no listados

  // Marcar históricos como keep=true por defecto (se manejarán aparte si hay conflictos, pero son únicos por definición aquí)
  vehicles.filter(v => ['bmw-320i-m-sport-2024','porsche-panamera-gts-2017','jeep-compass-2011'].includes(v.slug)).forEach(v => v.keep = true);

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
    "image": "/placeholder-car.webp",
    "images": []
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
  'Bmw_320iM_sport_2018': 'bmw-320d-2018-sport',
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
  'Nissan-Xtrail-2024': 'nissan-x-trail-2024-exclusive',
  'Peugeot-5008-2018': 'peugeot-5008-2018-1-6-bluehdi',
  'Mazda-3-2016-manual': 'mazda-3-2016-1-6',
  'Jeep-Compass-2011': 'jeep-compass-2011',
  'Chevrolet-Dmax-2017': 'chevrolet-d-max-2017',
  'Marcedes Benz-A200-sedan': 'mercedes-benz-a200-sedan-2021-look-amg',
  'Fiat-Uno-2020': 'fiat-uno-way-2020',
  'Peugeot-3008-2017': 'peugeot-3008-2017',
  'Kia-Rio-2020': 'kia-rio-5-2020',
  // BMW 118i Look M 2024
  'BMW-118i Look-2024': 'bmw-118i-look-m-2024',
  'BMW-118i Look M-2024': 'bmw-118i-look-m-2024',
  'Chevrolet_Captiva_2020': 'chevrolet-captiva-2020',
  'Toyora_Raize_2025': 'toyota-raize-2025',
  'Ford_Territory_2023': 'ford-territory-2023',
  'Hyundai_Porter_2023': 'hyundai-porter-2023',
  'Toyota_ Landcruiser_2010': 'toyota-land-cruiser-2010',
  'Subaru_crosstrek _2025': 'subaru-crosstrek-2025',
  'Mitsubishi_L200Katana_2013': 'mitsubishi-l200-katana-2013',
  'Chevrolet_ Silverado_2024': 'chevrolet-silverado-zr2-2024-full',
  'Suzuki alto 800 2018': 'suzuki-alto-800-2018',
  'Ford Explorer Límites 2018': 'ford-explorer-limited-2018',
  'Ford Explorer Limited 2018': 'ford-explorer-limited-2018',
  'Chery IQ 2014': 'chery-iq-2014',
  'Chevrolet Tracker 2018': 'chevrolet-tracker-lt-2018',
  'Toyota Yaris 2022': 'toyota-yaris-sedan-2022',
  'Kia Seltos 2023': 'kia-seltos-2023',
  'Chevrolet Sail 2024': 'chevrolet-sail-ltz-2024',
  'Ford Fiesta 2017': 'ford-fiesta-sedan-2017',
  'Ds7 2021': 'ds-7-rivoli-2021',
  'BMW 316i 2016': 'bmw-316i-2016',
  'Suzuki GN 2014': 'suzuki-grand-nomade-glx-2014',
  'Chevrolet LTZ 2021': 'chevrolet-colorado-ltz-2021',
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
      const normalizeFolderKey = (s) => String(s || '')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().replace(/\s+/g, ' ').trim();
      const normalizedFolderName = normalizeFolderKey(folderName);
      const matchingKey = Object.keys(folderToSlugMapping).find(k => normalizeFolderKey(k) === normalizedFolderName);
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

    const normalized = toKebab(raw);
    const parts = normalized.split('-').filter(Boolean);
    if (parts.length < 3) continue;

    let yearIdx = -1;
    for (let i = parts.length - 1; i >= 0; i--) {
      const n = parseInt(parts[i], 10);
      if (String(parts[i]).length === 4 && Number.isFinite(n) && n >= 1900 && n <= 2100) {
        yearIdx = i;
        break;
      }
    }
    if (yearIdx === -1) continue;

    const brand = parts[0];
    const model = parts.slice(1, yearIdx).join(' ');
    const year = parseInt(parts[yearIdx], 10);
    const version = parts.slice(yearIdx + 1).join(' ') || '';

    if (!brand || !model || !year || isNaN(year)) continue;

    const slug = normalized;
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
        price: 9350000, owners: 1, state: 'Vendido',
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
        slug: 'bmw-118i-look-m-2024',
        brand: 'BMW', model: '118i', year: 2024, version: 'Look M',
        transmission: 'Automática', fuel: 'Bencina', kilometers: 39900,
        price: 27990000, owners: 1, state: 'En venta', region: 'Las Condes',
        description: `✨ Versión Look M – Full equipo
✅ Motor 1.5 Turbo BMW TwinPower, potente y eficiente
✅ Transmisión automática deportiva y muy cómoda
✅ Sunroof panorámico
✅ Único dueño
✅ Pantalla multimedia BMW iDrive + conectividad
✅ Volante deportivo multifunción
✅ Sensores de estacionamiento + cámara
✅ Interior premium y excelente calidad de terminaciones
✅ Gran maletero y cabina cómoda para 5 pasajeros

🧾 Vehículo en estado impecable, sin detalles.
✔️ Todas las mantenciones realizadas en la marca
✔️ Mantención de 40.000 km ya realizada
✔️ Incluye mantenciones de 50.000 y 60.000 km GRATIS en BMW
✔️ Primera cuota del permiso de circulación 2026 pagada

📲 Escríbeme por mensaje o WhatsApp para coordinar visita o enviarte más fotos del vehículo.
💰 CONSULTE POR FINANCIAMIENTO AUTOMOTRIZ
💳 VEHÍCULO CON PREPAGO DE FINANCIAMIENTO`,
      },
      {
        slug: 'nissan-x-trail-2024-exclusive',
        brand: 'Nissan', model: 'X-Trail', year: 2024, version: 'Exclusive',
        transmission: 'Automática', fuel: 'Bencina', kilometers: 33000,
        price: 27290000, owners: 1, state: 'Vendido',
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
        slug: 'ford-fusion-2020-hibrido',
        brand: 'Ford', model: 'Fusion', year: 2020, version: 'Híbrido',
        transmission: 'Automática', fuel: 'Eléctrico', kilometers: 89000,
        price: 15550000, owners: 1, state: 'En venta', region: 'Colina',
        engine: '2.0', power: 188,
        description: `Híbrido · Automático
✅ Pantalla con conectividad
✅ Vehículo económico y confiable`,
      },
      {
        slug: 'peugeot-5008-2018-1-6-bluehdi',
        brand: 'Peugeot', model: '5008', year: 2018, version: '1.6 BlueHDi',
        transmission: 'Automática', fuel: 'Diésel', kilometers: 113000,
        price: 15890000, owners: 2, state: 'Vendido',
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
        price: 8890000, owners: 1, state: 'Vendido',
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
        price: 13750000, owners: 1, state: 'Vendido', region: 'Viña del Mar',
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
        price: 16890000, owners: 1, state: 'Vendido', region: 'Peñalolén',
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
      },
      {
        slug: 'bmw-320d-2018-sport',
        brand: 'BMW', model: '320d', year: 2018, version: 'Sport',
        transmission: 'Automática', fuel: 'Diésel', kilometers: 142000,
        price: 18990000, owners: 1, state: 'En venta', region: 'Santiago',
        description: `🔧 Diésel · Automático
📍 142.000 km · 2 llaves
✔️ Todas las mantenciones hechas rigurosamente.
🔥 Motor diésel eficiente y potente: equilibrio entre potencia y economía típico de esta versión del Serie 3.
🔥 Prestaciones de sedán premium: ágil y sólido en autopista y ciudad.
🔥 Buen espacio interior y maletero: práctico para el día a día y viajes.
🔥 Estilo y presencia BMW: diseño deportivo, interior cuidado y conducción dinámica.
📄 Documentación al día y lista para transferir
🔁 Se recibe vehículo menor como parte de pago
💳 Financiamiento disponible`,
        abs: true
      },
      {
        slug: 'jeep-compass-2011',
        brand: 'Jeep', model: 'Compass', year: 2011,
        transmission: 'Automática', fuel: 'Bencina', kilometers: 166000,
        price: 9350000, owners: 1, state: 'Vendido', region: 'Santiago',
        description: `✔️ Automático · Bencina
✔️ 166.000 km · Dos llaves
✔️ SUV versátil para ciudad y carretera
📄 Documentación al día, lista para transferir
🔁 Se recibe vehículo menor en parte de pago`,
        abs: true, esp: true, airbags: 'Múltiples'
      },
      {
        slug: 'chevrolet-d-max-2017',
        brand: 'Chevrolet', model: 'D-Max', year: 2017, version: '4x2',
        transmission: 'Manual', fuel: 'Diésel', kilometers: 142000,
        price: 8990000, owners: 1, state: 'En venta', region: 'Santiago',
        description: `✔️ Diésel · 4x2 · Mecánica
✔️ Camioneta firme y confiable, ideal para trabajo
⚠️ Aire acondicionado no funciona (considerado en el precio)
📄 Documentación al día, lista para transferir
💳 Financiamiento disponible`
      },
      {
        slug: 'mercedes-benz-a200-sedan-2021-look-amg',
        brand: 'Mercedes-Benz', model: 'A200', year: 2021, version: 'Sedan Look AMG',
        transmission: 'Automática', fuel: 'Bencina', kilometers: 82400,
        price: 21990000, owners: 3, state: 'Vendido', region: 'Santiago',
        engine: '1.3 Turbo',
        description: `✨ Deportivo, elegante y full tecnología
✔️ Look AMG
✔️ Apple CarPlay + Bluetooth
✔️ Sensores + cámara trasera
✔️ Modos ECO / Comfort / Sport
🔄 Recibo vehículo de menor valor
💳 Consulte por financiamiento`,
        bluetooth: true
      },

      {
        slug: 'peugeot-3008-2017',
        brand: 'Peugeot', model: '3008', year: 2017,
        transmission: 'Automática', fuel: 'Bencina', kilometers: null,
        price: 11890000, owners: 1, state: 'En venta', region: 'Las Condes',
        description: `✅ Bencinero Automático
✅ Sensores de estacionamiento + cámara de retroceso
✅ Climatizador automático
✅ Control de estabilidad y múltiples airbags
💰 Consulte por financiamiento automotriz`,
        abs: true, esp: true, airbags: 'Múltiples', airConditioning: true
      },
      {
        slug: 'fiat-uno-way-2020',
        brand: 'Fiat', model: 'Uno Way', year: 2020,
        transmission: 'Manual', fuel: 'Bencina', kilometers: 44000,
        price: 6190000, owners: 1, state: 'Vendido', region: 'Las Condes',
        description: `✅ Motor 1.4 bencinero
✅ Bluetooth / USB
❌ Sin aire acondicionado
✅ Frenos ABS + doble airbag
💰 Consulte por financiamiento automotriz`,
        abs: true, airbags: 'Frontales', airConditioning: false, bluetooth: true, usb: true
      },
      {
        slug: 'chevrolet-captiva-2020',
        brand: 'Chevrolet', model: 'Captiva', year: 2020,
        transmission: 'Manual', fuel: 'Bencina', kilometers: 98000,
        price: 9650000, owners: 1, state: 'En venta', region: 'Las Condes',
        description: `✅ Motor 1.5 Turbo bencinero (Delta Motors)
✅ Mecánica · versión equipada
✅ 5 a 7 pasajeros · cuero · climatizador
✅ Pantalla táctil + CarPlay/BT · cámara + sensores
✅ Gran maletero · mantenciones al día`
      },
      {
        slug: 'toyota-raize-2025',
        brand: 'Toyota', model: 'Raize', year: 2025,
        transmission: 'Manual', fuel: 'Bencina', kilometers: 7000,
        price: 11890000, owners: 1, state: 'Vendido', region: 'Las Condes',
        description: `✅ 1.2L Dual VVT-i · económico
✅ Único dueño · 2 llaves · 7.000 km
✅ CarPlay/Android Auto · cámara
✅ ABS + control estabilidad · aire acondicionado`
      },
      {
        slug: 'ford-territory-2023',
        brand: 'Ford', model: 'Territory', year: 2023,
        transmission: 'Automática', fuel: 'Bencina', kilometers: 21000,
        price: 11650000, owners: 1, state: 'En venta', region: 'Las Condes',
        description: `✅ Full equipo · techo panorámico
✅ 21.000 km · 2 llaves
✅ CarPlay/Android Auto · cámara + sensores
✅ Climatizador · múltiples airbags`
      },
      {
        slug: 'hyundai-porter-2023',
        brand: 'Hyundai', model: 'Porter', year: 2023,
        transmission: 'Manual', fuel: 'Diésel', kilometers: 122000,
        price: 14990000, owners: 1, state: 'En venta', region: 'Las Condes',
        description: `✅ 2.5 Turbo diésel · mecánica
✅ Doble cabina · dirección asistida
✅ Excelente capacidad de carga · mantenciones al día
✅ Listo para trabajar`
      },
      {
        slug: 'toyota-land-cruiser-2010',
        brand: 'Toyota', model: 'Land Cruiser', year: 2010,
        transmission: 'Automática', fuel: 'Bencina', kilometers: 258000,
        price: 11990000, owners: 1, state: 'Vendido', region: 'Las Condes',
        description: `✅ Automática 4x4 · 7 pasajeros
✅ Climatizador · volante multifunción
✅ Gran maletero · mantenciones al día
✅ SUV robusto y confiable para todo terreno`
      },
      {
        slug: 'subaru-crosstrek-2025',
        brand: 'Subaru', model: 'Crosstrek', year: 2025,
        transmission: 'Automática', fuel: 'Bencina', kilometers: 8000,
        price: 23990000, owners: 1, state: 'En venta', region: 'Las Condes',
        description: `✅ Boxer + CVT + AWD
✅ Único dueño · 8.000 km
✅ CarPlay/Android Auto · cámara + sensores
✅ Muy seguro y tecnológico`
      },
      {
        slug: 'mitsubishi-l200-katana-2013',
        brand: 'Mitsubishi', model: 'L200 Katana', year: 2013, version: '4x2',
        transmission: 'Manual', fuel: 'Diésel', kilometers: 171000,
        price: 10390000, owners: 1, state: 'Vendido', region: 'Las Condes',
        description: `✅ 2.5 Turbo diésel · mecánica
✅ Único dueño · 4x2
✅ Semi nuevos · mantenciones al día
✅ Lista para trabajo o uso personal`
      },
      {
        slug: 'chevrolet-silverado-zr2-2024-full',
        brand: 'Chevrolet', model: 'Silverado ZR2', year: 2024, version: '4x4',
        transmission: 'Automática', fuel: 'Bencina', kilometers: 60000,
        price: 37790000, owners: 1, state: 'En venta', region: 'Las Condes',
        description: `✅ V8 bencinero · automática · 4x4 ZR2
✅ Único dueño · cuero · climatizador
✅ CarPlay/Android Auto · cámara 360 + sensores
✅ Mantenciones al día en la marca`
      },
      {
        slug: 'suzuki-alto-800-2018',
        brand: 'Suzuki', model: 'Alto 800', year: 2018,
        transmission: 'Manual', fuel: 'Bencina', kilometers: 107000,
        price: 3390000, owners: 1, state: 'Vendido', region: 'Las Condes',
        description: `✅ 800 cc bencinero · mecánico · muy económico
✅ Excelente consumo · USB · mantenciones al día
✅ Ideal como primer auto o para trabajo`
      },
      {
        slug: 'ford-explorer-limited-2018',
        brand: 'Ford', model: 'Explorer', year: 2018, version: 'Limited',
        transmission: 'Automática', fuel: 'Bencina', kilometers: 100000,
        price: 18790000, owners: 1, state: 'En venta', region: 'Las Condes',
        description: `✅ Limited full equipo · 7 pasajeros
✅ Cuero eléctrico calefaccionado · sunroof panorámico
✅ CarPlay/Android Auto · cámara + sensores
✅ Climatizador bi-zona · mantenciones al día`
      },
      {
        slug: 'chery-iq-2014',
        brand: 'Chery', model: 'IQ', year: 2014,
        transmission: 'Manual', fuel: 'Bencina', kilometers: 124000,
        price: 2550000, owners: 1, state: 'Vendido', region: 'Las Condes',
        description: `✅ 1.0 bencinero · mecánico
✅ Excelente rendimiento de combustible
✅ Dirección asistida · USB
✅ Ideal como primer auto o para trabajo`
      },
      {
        slug: 'chevrolet-tracker-lt-2018',
        brand: 'Chevrolet', model: 'Tracker', year: 2018, version: 'LT',
        transmission: 'Manual', fuel: 'Bencina', kilometers: 105000,
        price: 8500000, owners: 1, state: 'En venta', region: 'Las Condes',
        description: `✅ LT 1.8 bencinero · mecánica
✅ MyLink + Bluetooth/USB · cámara
✅ Volante multifunción · aire acondicionado
✅ ABS + control de estabilidad · múltiples airbags`
      },
      {
        slug: 'mazda-2-gt-2015',
        brand: 'Mazda', model: '2', year: 2015, version: 'GT',
        transmission: 'Manual', fuel: 'Bencina', kilometers: 124000,
        price: 6690000, owners: 1, state: 'En venta', region: 'Las Condes',
        description: `🚗 Mazda 2 GT 2015 – Mecánico | Full Equipo

📍 Las Condes
⏱️ 124.000 km
⛽ Bencinero

✨ Versión GT

✅ Motor 1.5, potente, confiable y muy económico.
✅ Transmisión mecánica.
✅ Aire acondicionado.
✅ Llantas de aleación.
✅ Alzavidrios eléctricos.
✅ Espejos eléctricos.
✅ Cierre centralizado.
✅ Dirección asistida.
✅ Frenos ABS con EBD.
✅ Airbags delanteros.
✅ Mantenciones al día.

🧾 Vehículo muy bien cuidado, listo para transferir y disfrutar.

🚗 Excelente opción por su confiabilidad, bajo consumo, mecánica simple y económica de mantener.

📍 Las Condes
📲 Escríbeme por mensaje o WhatsApp para coordinar una visita o solicitar más fotos del vehículo.

💰 CONSULTE POR FINANCIAMIENTO AUTOMOTRIZ CON 50% DE PIE

🚗 RECIBIMOS VEHÍCULO EN PARTE DE PAGO (PREVIA EVALUACIÓN)`,
        abs: true, airbags: 'Frontales', airConditioning: true,
        powerSteering: true, electricWindows: true, electricMirrors: true
      },
      { slug: 'toyota-yaris-sedan-2022', brand: 'Toyota', model: 'Yaris', year: 2022, version: 'Sedán', transmission: 'Manual', fuel: 'Bencina', kilometers: 110000, price: 9990000, owners: 1, state: 'En venta', region: 'Las Condes', description: `✅ Sedán 1.5 Dual VVT-i · mecánico
✅ CarPlay/Android Auto · cámara
✅ 6 airbags · VSC · HAC · ABS/EBD
✅ Amplio maletero · mantenciones al día`, abs: true, esp: true, airbags: '6 airbags', audioSystem: true },
      { slug: 'kia-seltos-2023', brand: 'Kia', model: 'Seltos', year: 2023, transmission: 'Manual', fuel: 'Bencina', kilometers: 97000, price: 12990000, owners: 1, state: 'En venta', region: 'Las Condes', description: `✅ 1.6 bencinero · mecánica
✅ Pantalla 10,25" · CarPlay/Android Auto · cámara
✅ Aire acondicionado · crucero
✅ Control de estabilidad · HAC · múltiples airbags`, airConditioning: true, cruiseControl: true, esp: true, airbags: 'Múltiples', audioSystem: true },
      { slug: 'chevrolet-sail-ltz-2024', brand: 'Chevrolet', model: 'Sail', year: 2024, version: 'LTZ', transmission: 'Automática', fuel: 'Bencina', kilometers: 28000, price: 10790000, owners: 1, state: 'En venta', region: 'Las Condes', description: `✅ LTZ 1.5 bencinero · automática CVT
✅ Solo 28.000 km
✅ Pantalla 8" · CarPlay/Android Auto · cámara + sensores
✅ 6 airbags · estabilidad · ABS/EBD`, abs: true, esp: true, airbags: '6 airbags', airConditioning: true, audioSystem: true },
      { slug: 'ford-fiesta-sedan-2017', brand: 'Ford', model: 'Fiesta', year: 2017, version: 'Sedán', transmission: 'Manual', fuel: 'Bencina', kilometers: 187000, price: 6790000, owners: 1, state: 'Vendido', region: 'Las Condes', description: `✅ Sedán 1.6 Ti-VCT · mecánico
✅ Dirección asistida eléctrica · aire acondicionado
✅ Volante multifunción · vidrios y espejos eléctricos
✅ ABS · múltiples airbags · mantenciones al día`, abs: true, airbags: 'Múltiples', airConditioning: true, powerSteering: true, electricWindows: true, electricMirrors: true },
      { slug: 'ds-7-rivoli-2021', brand: 'DS', model: '7', year: 2021, version: 'Rivoli', transmission: 'Automática', fuel: 'Diésel', kilometers: 85000, price: 19990000, owners: 1, state: 'En venta', region: 'Las Condes', description: `✅ 2.0 BlueHDi Turbo Diésel · automática EAT8
✅ Único dueño · Rivoli · sunroof panorámico
✅ Cuero eléctrico con memoria y calefacción
✅ CarPlay/Android Auto · cámara 360 · climatizador bi-zona`, airConditioning: true, airbags: 'Múltiples', bluetooth: true, usb: true, audioSystem: true },
      { slug: 'bmw-316i-2016', brand: 'BMW', model: '316i', year: 2016, transmission: 'Automática', fuel: 'Bencina', kilometers: 107000, price: 12990000, owners: 2, state: 'En venta', region: 'Las Condes', description: `✅ 1.6 TwinPower Turbo · automática de 8 velocidades
✅ Segundo dueño · iDrive · volante multifunción
✅ Climatizador bi-zona · sensores
✅ Estabilidad · airbags · mantenciones al día`, airConditioning: true, esp: true, airbags: 'Múltiples', audioSystem: true },
      { slug: 'suzuki-grand-nomade-glx-2014', brand: 'Suzuki', model: 'Grand Nomade', year: 2014, version: 'GLX 4x2', transmission: 'Manual', fuel: 'Bencina', kilometers: 160000, price: 7790000, owners: 1, state: 'En venta', region: 'Las Condes', description: `✅ GLX 2.4 bencinero · mecánica · 4x2
✅ Única dueña · dos llaves
✅ Climatizador · volante multifunción
✅ ABS · airbags · mantenciones al día`, abs: true, airbags: 'Múltiples', airConditioning: true },
      { slug: 'chevrolet-colorado-ltz-2021', brand: 'Chevrolet', model: 'Colorado', year: 2021, version: 'LTZ', transmission: 'Automática', fuel: 'Diésel', kilometers: 200000, price: 16850000, owners: 2, state: 'En venta', region: 'Las Condes', description: `✅ LTZ 2.8 Turbo Diésel Duramax · automática
✅ Segundo dueño · CarPlay/Android Auto
✅ Cámara + sensores · cuero · climatizador
✅ Levante 2,5" · neumáticos anchos · coco de arrastre`, airConditioning: true, airbags: 'Múltiples', audioSystem: true },
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
        const images = await getVehicleImages(folderName);
        
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

    vehicles = vehicles.filter(v => v.slug !== 'bmw-2018-2018');

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
      'bmw-320im-sport-2024',
      'bmw-118i-look-m-2024',
      'kia-rio-5-2020',
      'subaru-crosstrek-2025',
      'ford-territory-2023',
      'chevrolet-d-max-2017',
      'chevrolet-captiva-2020',
      'ford-fusion-2020-hibrido',
      'peugeot-3008-2017'
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
      'mazda-3-2016-1-6',
      'ford-fusion-2020-hibrido',
      'jeep-compass-2011',
      'chevrolet-d-max-2017',
      'mercedes-benz-a200-sedan-2021-look-amg',
      'kia-rio-5-2020',
      'peugeot-3008-2017',
      'fiat-uno-way-2020',
      'chevrolet-captiva-2020',
      'toyota-raize-2025',
      'ford-territory-2023',
      'hyundai-porter-2023',
      'toyota-land-cruiser-2010',
      'subaru-crosstrek-2025',
      'mitsubishi-l200-katana-2013',
      'chevrolet-silverado-zr2-2024-full',
      'suzuki-alto-800-2018',
      'ford-explorer-limited-2018',
      'chery-iq-2014',
      'chevrolet-tracker-lt-2018',
      'mazda-2-gt-2015',
      'toyota-yaris-sedan-2022',
      'kia-seltos-2023',
      'chevrolet-sail-ltz-2024',
      'ford-fiesta-sedan-2017',
      'ds-7-rivoli-2021',
      'bmw-316i-2016',
      'suzuki-grand-nomade-glx-2014',
      'chevrolet-colorado-ltz-2021'
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

    let prev = [];
    if (await fs.pathExists(OUTPUT_VEHICLES)) {
      try { prev = await fs.readJson(OUTPUT_VEHICLES); } catch {}
    }
    const prevMap = new Map(prev.map(p => [p.slug, p]));
    const today = new Date().toISOString().slice(0,10);
    for (const v of vehicles) {
      const before = prevMap.get(v.slug);
      if (v.state === 'Vendido') {
        if (before && before.state === 'Vendido' && before.soldAt) {
          v.soldAt = before.soldAt;
        } else if (before && before.state !== 'Vendido') {
          v.soldAt = today;
        } else if (!before || !before.soldAt) {
          v.soldAt = today;
        }
      } else {
        if (v.soldAt) delete v.soldAt;
      }
    }

    await fs.ensureDir(path.dirname(OUTPUT_VEHICLES));
    await fs.ensureDir(path.dirname(OUTPUT_SLUGS));

    await fs.writeJson(OUTPUT_VEHICLES, vehicles, { spaces: 2 });
    await fs.writeJson(OUTPUT_SLUGS, slugs, { spaces: 2 });

    const sales = vehicles.filter(v => v.state === 'Vendido' && v.soldAt);
    const byMonth = {};
    for (const s of sales) {
      const m = String(s.soldAt).slice(0,7);
      byMonth[m] = (byMonth[m] || 0) + 1;
    }
    console.log('🗓️ Ventas por mes:');
    Object.keys(byMonth).sort().forEach(m => {
      console.log(`   ${m}: ${byMonth[m]}`);
    });

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