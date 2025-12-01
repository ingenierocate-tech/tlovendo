const fs = require('fs');
const path = require('path');

const AUTOS_DIR = path.join(__dirname, '../public/autos');
const OUTPUT_PATH = path.join(__dirname, '../src/data/vehicles.local.json');

function splitSlug(slug) {
  // Si el slug tiene guiones, úsalos; si no, usa espacios.
  const hasHyphen = slug.includes('-');
  const parts = hasHyphen ? slug.split('-') : slug.split(/\s+/);
  return { parts, hasHyphen };
}

function getIdFromSlug(slug) {
  const hyphenMatch = slug.match(/^(\d+)-/);
  const spaceMatch = slug.match(/^(\d+)\s/);
  const match = hyphenMatch || spaceMatch;
  return match ? parseInt(match[1], 10) : Math.floor(Math.random() * 100000);
}

function parseBrandModelVersion(slug) {
  const { parts, hasHyphen } = splitSlug(slug);
  // Quita ID inicial si existe
  let tokens = parts;
  if (hasHyphen && /^\d+$/.test(parts[0])) tokens = parts.slice(1);
  if (!hasHyphen && /^\d+$/.test(parts[0])) tokens = parts.slice(1);

  const brand = tokens[0] || 'Marca';
  const model = tokens[1] || 'Modelo';
  const version = tokens.slice(2).join(hasHyphen ? '-' : ' ') || 'Versión';
  return { brand, model, version };
}

function hasLateral(slug) {
  return fs.existsSync(path.join(AUTOS_DIR, slug, '01_lateral.jpg'));
}

function buildVehicle(slug) {
  const id = getIdFromSlug(slug);
  const { brand, model, version } = parseBrandModelVersion(slug);
  const lateralPath = `/autos/${slug}/01_lateral.jpg`;
  const vehicleImage = hasLateral(slug) ? lateralPath : '/placeholder-car.webp';

  return {
    id,
    slug,
    brand,
    model,
    version,
    year: null,
    owners: 1,
    color: 'Blanco',
    transmission: 'Automática',
    fuel: 'Bencina',
    region: 'RM',
    state: 'En venta',
    engine: 'En venta',
    power: 120,
    consumption: '',
    emissions: '',
    abs: false,
    esp: false,
    tractionControl: false,
    airConditioning: false,
    powerSteering: true,
    electricWindows: false,
    electricMirrors: false,
    audioSystem: false,
    bluetooth: false,
    usb: false,
    cruiseControl: false,
    image: '/placeholder-car.webp',
    images: [],
    image: vehicleImage
  };
}

function generateVehicles() {
  if (!fs.existsSync(AUTOS_DIR)) {
    console.error(`No existe el directorio: ${AUTOS_DIR}`);
    process.exit(1);
  }

  const folders = fs
    .readdirSync(AUTOS_DIR)
    .filter((name) => fs.statSync(path.join(AUTOS_DIR, name)).isDirectory());

  const vehicles = folders.map(buildVehicle);

  // Reporte de faltantes
  const missing = folders.filter((slug) => !hasLateral(slug));
  if (missing.length) {
    console.warn(`⚠️ Faltan 01_lateral.jpg en ${missing.length} carpeta(s):`);
    missing.forEach((slug) => console.warn(` - /autos/${slug}/01_lateral.jpg`));
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(vehicles, null, 2));
  console.log(`✅ Generados ${vehicles.length} vehículos en: ${OUTPUT_PATH}`);
}

generateVehicles();