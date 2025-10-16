const fs = require('fs-extra');
const path = require('path');

async function fixSlugMapping() {
  console.log('🔧 Aplicando mapeo de slugs a carpetas...');
  
  const buildScript = path.join(process.cwd(), 'scripts/build-local-vehicles.js');
  let content = await fs.readFile(buildScript, 'utf8');
  
  // Buscar la función getVehicleImages y agregar mapeo
  const mappingCode = `
// Mapeo de slugs problemáticos a carpetas reales
const slugToFolderMapping = {
  'kia-morning-2024-full': 'kia-Morning-2024'
};

async function getVehicleImages(slug) {
  // Aplicar mapeo si existe
  const actualSlug = slugToFolderMapping[slug] || slug;
  const vehicleDir = path.join(AUTOS_DIR, actualSlug);`;
  
  // Reemplazar el inicio de la función
  content = content.replace(
    /async function getVehicleImages\(slug\) \{\s*const vehicleDir = path\.join\(AUTOS_DIR, slug\);/,
    mappingCode
  );
  
  await fs.writeFile(buildScript, content);
  console.log('✅ Mapeo aplicado al script');
  
  // Regenerar catálogo
  console.log('🔄 Regenerando catálogo...');
  const { buildLocalVehicles } = require('./build-local-vehicles.js');
  await buildLocalVehicles();
  
  console.log('✅ Corrección completada!');
}

if (require.main === module) {
  fixSlugMapping().catch(console.error);
}