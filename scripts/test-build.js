const fs = require('fs-extra');
const path = require('path');

console.log('=== DIAGNÓSTICO BUILD LOCAL ===');
console.log('Directorio actual:', process.cwd());

const EXCEL_PATH = path.join(process.cwd(), 'public/autos/catalogo.xlsx');
const AUTOS_DIR = path.join(process.cwd(), 'public/autos');

console.log('Excel path:', EXCEL_PATH);
console.log('Excel existe:', fs.existsSync(EXCEL_PATH));

console.log('Autos dir:', AUTOS_DIR);
console.log('Autos dir existe:', fs.existsSync(AUTOS_DIR));

if (fs.existsSync(AUTOS_DIR)) {
  const items = fs.readdirSync(AUTOS_DIR);
  console.log('Contenido de autos dir:', items);
}

// Intentar ejecutar el script principal
console.log('\n=== EJECUTANDO BUILD ===');
try {
  const { buildLocalVehicles } = require('./build-local-vehicles.js');
  buildLocalVehicles().then(() => {
    console.log('Build completado exitosamente');
  }).catch(err => {
    console.error('Error en build:', err);
  });
} catch (err) {
  console.error('Error al cargar el script:', err);
}