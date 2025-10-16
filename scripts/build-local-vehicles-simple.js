const fs = require('fs');
const path = require('path');

// Función para convertir texto a kebab-case
function toKebabCase(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Función para construir rutas de imágenes locales
function buildImagePaths(slug) {
  const imageTypes = [
    { filename: '01_lateral.jpg', alt: 'Vista lateral', isPrimary: true },
    { filename: '02_frontal.jpg', alt: 'Vista frontal', isPrimary: false },
    { filename: '03_posterior.jpg', alt: 'Vista posterior', isPrimary: false },
    { filename: '04_tablero.jpg', alt: 'Tablero', isPrimary: false },
    { filename: '05_asientos.jpg', alt: 'Asientos', isPrimary: false }
  ];

  return imageTypes.map(img => ({
    url: `/autos/${slug}/${img.filename}`,
    alt: img.alt,
    isPrimary: img.isPrimary
  }));
}

// Datos de vehículos basados en las carpetas existentes
const vehicleData = [
  {
    brand: 'Kia',
    model: 'Morning',
    year: 2024,
    version: 'LX',
    price: 8500000,
    mileage: '15,000',
    color: 'Blanco',
    transmission: 'Manual',
    fuel: 'Bencina',
    location: 'Santiago',
    condition: 'Excelente',
    engine: '1.2L',
    power: '84 HP',
    consumption: '5.8L/100km'
  },
  {
    brand: 'Kia',
    model: 'Sonet',
    year: 2024,
    version: 'Full',
    price: 14500000,
    mileage: '8,000',
    color: 'Gris',
    transmission: 'Automática',
    fuel: 'Bencina',
    location: 'Santiago',
    condition: 'Excelente',
    engine: '1.6L',
    power: '123 HP',
    consumption: '6.2L/100km'
  },
  {
    brand: 'Suzuki',
    model: 'Alto',
    year: 2022,
    version: '800',
    price: 7200000,
    mileage: '25,000',
    color: 'Azul',
    transmission: 'Manual',
    fuel: 'Bencina',
    location: 'Valparaíso',
    condition: 'Muy bueno',
    engine: '0.8L',
    power: '68 HP',
    consumption: '4.9L/100km'
  },
  {
    brand: 'Hyundai',
    model: 'Tucson',
    year: 2018,
    version: 'Full',
    price: 16800000,
    mileage: '45,000',
    color: 'Negro',
    transmission: 'Automática',
    fuel: 'Bencina',
    location: 'Santiago',
    condition: 'Muy bueno',
    engine: '2.0L',
    power: '165 HP',
    consumption: '7.8L/100km'
  },
  {
    brand: 'Mercedes-Benz',
    model: 'GLC',
    year: 2016,
    version: '220d',
    price: 28500000,
    mileage: '78,000',
    color: 'Plata',
    transmission: 'Automática',
    fuel: 'Diésel',
    location: 'Las Condes',
    condition: 'Bueno',
    engine: '2.2L Turbo',
    power: '170 HP',
    consumption: '5.5L/100km'
  },
  {
    brand: 'Toyota',
    model: 'Avensis',
    year: 2013,
    version: 'GL',
    price: 9800000,
    mileage: '125,000',
    color: 'Blanco',
    transmission: 'Manual',
    fuel: 'Bencina',
    location: 'Viña del Mar',
    condition: 'Bueno',
    engine: '1.8L',
    power: '147 HP',
    consumption: '6.8L/100km'
  },
  {
    brand: 'Chevrolet',
    model: 'Tahoe',
    year: 2018,
    version: 'LT',
    price: 35000000,
    mileage: '65,000',
    color: 'Negro',
    transmission: 'Automática',
    fuel: 'Bencina',
    location: 'Santiago',
    condition: 'Muy bueno',
    engine: '5.3L V8',
    power: '355 HP',
    consumption: '12.5L/100km'
  },
  {
    brand: 'Nissan',
    model: 'Pathfinder',
    year: 2018,
    version: 'Advance',
    price: 22500000,
    mileage: '52,000',
    color: 'Gris',
    transmission: 'Automática',
    fuel: 'Bencina',
    location: 'Santiago',
    condition: 'Excelente',
    engine: '3.5L V6',
    power: '284 HP',
    consumption: '9.2L/100km'
  },
  {
    brand: 'Ford',
    model: 'F-150',
    year: 2016,
    version: 'XLT',
    price: 18500000,
    mileage: '95,000',
    color: 'Blanco',
    transmission: 'Automática',
    fuel: 'Bencina',
    location: 'Rancagua',
    condition: 'Bueno',
    engine: '3.5L V6',
    power: '282 HP',
    consumption: '11.8L/100km'
  },
  {
    brand: 'Ford',
    model: 'Fusion',
    year: 2020,
    version: 'SE',
    price: 15800000,
    mileage: '32,000',
    color: 'Azul',
    transmission: 'Automática',
    fuel: 'Bencina',
    location: 'Santiago',
    condition: 'Excelente',
    engine: '2.5L',
    power: '175 HP',
    consumption: '7.1L/100km'
  },
  {
    brand: 'Kia',
    model: 'Soluto',
    year: 2024,
    version: 'LX',
    price: 11200000,
    mileage: '5,000',
    color: 'Rojo',
    transmission: 'Manual',
    fuel: 'Bencina',
    location: 'Santiago',
    condition: 'Excelente',
    engine: '1.4L',
    power: '95 HP',
    consumption: '6.0L/100km'
  }
];

function generateSlug(brand, model, year, version) {
  let slug = `${brand}-${model}-${year}`;
  if (version && version !== 'No disponible' && version.trim() !== '') {
    slug += `-${version}`;
  }
  return toKebabCase(slug);
}

function buildLocalVehicles() {
  try {
    console.log('🚗 Generando vehículos locales desde datos predefinidos...');
    
    const vehicles = [];
    const vehicleSlugs = [];

    vehicleData.forEach((data, index) => {
      const slug = generateSlug(data.brand, data.model, data.year, data.version);
      const title = `${data.brand} ${data.model} ${data.year}`;
      
      const vehicle = {
        id: slug,
        slug: slug,
        title: title,
        brand: data.brand,
        model: data.model,
        year: data.year,
        version: data.version || 'No disponible',
        owners: '1',
        mileage: data.mileage || 'No disponible',
        color: data.color || 'No disponible',
        transmission: data.transmission || 'Manual',
        price: data.price || 'No disponible',
        fuel: data.fuel || 'Bencina',
        location: data.location || 'No disponible',
        condition: data.condition || 'Bueno',
        engine: data.engine || 'No disponible',
        power: data.power || 'No disponible',
        consumption: data.consumption || 'No disponible',
        images: buildImagePaths(slug),
        featured: index < 3, // Los primeros 3 como destacados
        
        // Campos adicionales para compatibilidad
        kilometers: data.mileage ? parseInt(data.mileage.replace(/[^\d]/g, '')) : null,
        region: data.location,
        image: `/autos/${slug}/01_lateral.jpg`,
        publishedAt: new Date().toISOString().split('T')[0],
        
        // Características de seguridad (valores por defecto)
        abs: true,
        esp: true,
        airbags: '2 airbags',
        tractionControl: false,
        
        // Características de confort (valores por defecto)
        airConditioning: true,
        powerSteering: true,
        electricWindows: false,
        electricMirrors: false,
        audioSystem: true,
        bluetooth: false,
        usb: false,
        cruiseControl: false
      };

      vehicles.push(vehicle);
      
      vehicleSlugs.push({
        slug: slug,
        brand: data.brand,
        model: data.model,
        year: data.year
      });

      console.log(`✅ Procesado: ${title} (${slug})`);
    });

    // Crear directorio de datos si no existe
    const dataDir = path.join(process.cwd(), 'src', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Escribir archivo de vehículos completo
    const vehiclesPath = path.join(dataDir, 'vehicles.local.json');
    fs.writeFileSync(vehiclesPath, JSON.stringify(vehicles, null, 2));
    console.log(`💾 Guardado: ${vehiclesPath} (${vehicles.length} vehículos)`);

    // Escribir archivo de slugs para rutas
    const slugsPath = path.join(dataDir, 'vehicles.slugs.local.json');
    fs.writeFileSync(slugsPath, JSON.stringify(vehicleSlugs, null, 2));
    console.log(`💾 Guardado: ${slugsPath} (${vehicleSlugs.length} slugs)`);

    // Resumen final
    console.log('\n📈 Resumen de construcción:');
    console.log(`   • Vehículos procesados: ${vehicles.length}`);
    console.log(`   • Imágenes por vehículo: 5`);
    console.log(`   • Total de imágenes esperadas: ${vehicles.length * 5}`);
    console.log(`   • Archivo principal: src/data/vehicles.local.json`);
    console.log(`   • Archivo de slugs: src/data/vehicles.slugs.local.json`);
    
    console.log('\n🚗 Vehículos procesados:');
    vehicles.forEach(v => {
      console.log(`   • ${v.title} → ${v.slug}`);
    });

    console.log('\n✅ Construcción de vehículos locales completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en la construcción de vehículos locales:', error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  buildLocalVehicles();
}

module.exports = { buildLocalVehicles };