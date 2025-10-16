const fs = require('fs-extra');
const path = require('path');

const AUTOS_DIR = path.join(process.cwd(), 'public/autos');

async function fixImageSlugs() {
  console.log('🔧 Corrigiendo slugs para que coincidan con carpetas...');
  
  // Obtener todas las carpetas de vehículos
  const items = await fs.readdir(AUTOS_DIR);
  const folders = [];
  
  for (const item of items) {
    const itemPath = path.join(AUTOS_DIR, item);
    const stat = await fs.stat(itemPath);
    if (stat.isDirectory()) {
      folders.push(item);
    }
  }
  
  console.log('📁 Carpetas encontradas:', folders);
  
  // Mapeo de correcciones conocidas
  const slugCorrections = {
    'kia-morning-2024-full': 'kia-Morning-2024'
  };
  
  // Verificar si hay más discrepancias
  const vehiclesPath = path.join(process.cwd(), 'src/data/vehicles.local.json');
  const vehicles = await fs.readJson(vehiclesPath);
  
  console.log('\n🔍 Verificando coincidencias...');
  for (const vehicle of vehicles) {
    const folderExists = folders.includes(vehicle.slug);
    if (!folderExists) {
      console.log(`❌ ${vehicle.slug} -> No existe carpeta`);
      
      // Buscar carpeta similar
      const similar = folders.find(folder => 
        folder.toLowerCase().includes(vehicle.brand.toLowerCase()) &&
        folder.toLowerCase().includes(vehicle.model.toLowerCase()) &&
        folder.includes(vehicle.year.toString())
      );
      
      if (similar) {
        console.log(`   ✅ Carpeta similar encontrada: ${similar}`);
        slugCorrections[vehicle.slug] = similar;
      }
    } else {
      console.log(`✅ ${vehicle.slug} -> OK`);
    }
  }
  
  // Aplicar correcciones
  console.log('\n🔧 Aplicando correcciones...');
  for (const vehicle of vehicles) {
    if (slugCorrections[vehicle.slug]) {
      const oldSlug = vehicle.slug;
      const newSlug = slugCorrections[vehicle.slug];
      vehicle.slug = newSlug;
      console.log(`   ${oldSlug} -> ${newSlug}`);
    }
  }
  
  // Guardar archivo corregido
  await fs.writeJson(vehiclesPath, vehicles, { spaces: 2 });
  console.log('\n💾 Archivo vehicles.local.json actualizado');
  
  // Regenerar con slugs corregidos
  console.log('\n🔄 Regenerando catálogo...');
  const { buildLocalVehicles } = require('./build-local-vehicles.js');
  await buildLocalVehicles();
  
  console.log('✅ Corrección completada!');
}

if (require.main === module) {
  fixImageSlugs().catch(console.error);
}

module.exports = { fixImageSlugs };