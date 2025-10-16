const fs = require('fs-extra');
const path = require('path');

async function testLocalVehicles() {
  console.log('🔍 Probando carga de vehículos locales...\n');
  
  const VEHICLES_LOCAL_PATH = path.join(process.cwd(), 'src/data/vehicles.local.json');
  
  try {
    // 1. Verificar si el archivo existe
    console.log('1. Verificando existencia del archivo...');
    const exists = await fs.pathExists(VEHICLES_LOCAL_PATH);
    console.log(`   Archivo existe: ${exists}`);
    console.log(`   Ruta: ${VEHICLES_LOCAL_PATH}\n`);
    
    if (!exists) {
      console.log('❌ El archivo no existe');
      return;
    }
    
    // 2. Leer el archivo
    console.log('2. Leyendo contenido del archivo...');
    const fileContent = await fs.readFile(VEHICLES_LOCAL_PATH, 'utf8');
    console.log(`   Tamaño del archivo: ${fileContent.length} caracteres\n`);
    
    // 3. Parsear JSON
    console.log('3. Parseando JSON...');
    const data = JSON.parse(fileContent);
    console.log(`   Estructura del JSON:`, Object.keys(data));
    
    // 4. Extraer vehículos
    console.log('\n4. Extrayendo vehículos...');
    const vehicles = data.vehicles || [];
    console.log(`   Número de vehículos: ${vehicles.length}`);
    
    if (vehicles.length > 0) {
      console.log('\n5. Primeros 3 vehículos:');
      vehicles.slice(0, 3).forEach((vehicle, index) => {
        console.log(`   ${index + 1}. ${vehicle.marca} ${vehicle.modelo} (${vehicle.año})`);
        console.log(`      Precio: $${vehicle.precio}`);
        console.log(`      Destacado: ${vehicle.destacado ? 'Sí' : 'No'}`);
        console.log(`      Imágenes: ${vehicle.imagenes?.length || 0}`);
        console.log('');
      });
    }
    
    console.log('✅ Prueba completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  }
}

testLocalVehicles();