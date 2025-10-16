const XLSX = require('xlsx');
const path = require('path');

const EXCEL_PATH = path.join(process.cwd(), 'public/autos/catalogo.xlsx');

console.log('🔍 Diagnosticando Excel...');
console.log('📁 Ruta:', EXCEL_PATH);

try {
  const workbook = XLSX.readFile(EXCEL_PATH);
  console.log('📊 Hojas disponibles:', workbook.SheetNames);
  
  // Verificar hoja Características
  if (workbook.Sheets['Características']) {
    const data = XLSX.utils.sheet_to_json(workbook.Sheets['Características']);
    console.log('✅ Hoja "Características" encontrada');
    console.log('📝 Número de filas:', data.length);
    console.log('🔑 Columnas de la primera fila:', Object.keys(data[0] || {}));
    console.log('📄 Primera fila de datos:', data[0]);
  } else {
    console.log('❌ Hoja "Características" no encontrada');
  }
  
  // Verificar hoja Fotos
  if (workbook.Sheets['Fotos']) {
    const data = XLSX.utils.sheet_to_json(workbook.Sheets['Fotos']);
    console.log('✅ Hoja "Fotos" encontrada');
    console.log('📝 Número de filas:', data.length);
    console.log('🔑 Columnas de la primera fila:', Object.keys(data[0] || {}));
  } else {
    console.log('❌ Hoja "Fotos" no encontrada');
  }
  
} catch (error) {
  console.error('❌ Error leyendo Excel:', error.message);
}