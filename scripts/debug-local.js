const fs = require('fs-extra');
const path = require('path');
const XLSX = require('xlsx');

async function debug() {
  console.log('🔍 DIAGNÓSTICO DEL BUILD LOCAL');
  console.log('==================================================');
  
  // 1. Verificar directorio actual
  console.log('📁 Directorio actual:', process.cwd());
  
  // 2. Verificar Excel
  const excelPath = path.join(process.cwd(), 'public/autos/catalogo.xlsx');
  console.log('📊 Ruta del Excel:', excelPath);
  console.log('📊 Excel existe:', await fs.pathExists(excelPath));
  
  // 3. Verificar directorio de autos
  const autosDir = path.join(process.cwd(), 'public/autos');
  console.log('📁 Directorio autos:', autosDir);
  console.log('📁 Directorio existe:', await fs.pathExists(autosDir));
  
  if (await fs.pathExists(autosDir)) {
    const items = await fs.readdir(autosDir);
    console.log('📁 Contenido del directorio autos:');
    for (const item of items) {
      const itemPath = path.join(autosDir, item);
      const stat = await fs.stat(itemPath);
      console.log(`  ${stat.isDirectory() ? '📁' : '📄'} ${item}`);
    }
  }
  
  // 4. Intentar leer Excel si existe
  if (await fs.pathExists(excelPath)) {
    try {
      console.log('\n📖 Intentando leer Excel...');
      const workbook = XLSX.readFile(excelPath);
      console.log('📊 Hojas disponibles:', workbook.SheetNames);
      
      for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);
        console.log(`📊 Hoja "${sheetName}": ${data.length} filas`);
        if (data.length > 0) {
          console.log(`📊 Columnas en "${sheetName}":`, Object.keys(data[0]));
        }
      }
    } catch (error) {
      console.error('❌ Error leyendo Excel:', error.message);
    }
  }
  
  console.log('\n✅ Diagnóstico completado');
}

debug().catch(console.error);