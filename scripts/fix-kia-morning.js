const fs = require('fs-extra');
const path = require('path');

async function fixKiaMorning() {
  console.log('🔧 Corrigiendo slug del Kia Morning...');
  
  const vehiclesPath = path.join(process.cwd(), 'src/data/vehicles.local.json');
  const vehicles = await fs.readJson(vehiclesPath);
  
  // Encontrar el Kia Morning y corregir su slug
  for (const vehicle of vehicles) {
    if (vehicle.slug === 'kia-morning-2024-full') {
      console.log(`Corrigiendo: ${vehicle.slug} -> kia-Morning-2024`);
      vehicle.slug = 'kia-Morning-2024';
      break;
    }
  }
  
  // Guardar cambios
  await fs.writeJson(vehiclesPath, vehicles, { spaces: 2 });
  console.log('✅ Slug corregido');
  
  // Regenerar catálogo
  console.log('🔄 Regenerando catálogo...');
  const { buildLocalVehicles } = require('./build-local-vehicles.js');
  await buildLocalVehicles();
  
  console.log('✅ Corrección completada!');
}

if (require.main === module) {
  fixKiaMorning().catch(console.error);
}