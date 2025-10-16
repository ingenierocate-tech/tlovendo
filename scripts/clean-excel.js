const XLSX = require('xlsx');
const path = require('path');

const EXCEL_PATH = path.join(process.cwd(), 'public/autos/catalogo.xlsx');

function cleanExcel() {
  console.log('🧹 Limpiando Excel del placeholder...');
  
  // Leer el archivo Excel
  const wb = XLSX.readFile(EXCEL_PATH);
  const sheet = wb.Sheets['Características'];
  
  if (!sheet) {
    console.log('❌ No se encontró la hoja "Características"');
    return;
  }
  
  // Convertir a array de arrays
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
  
  // Filtrar filas que no sean placeholder
  const cleanRows = rows.filter((row, index) => {
    if (index === 0) return true; // Mantener cabeceras
    
    const marca = row[1];
    const modelo = row[2];
    const anio = row[3];
    
    // Eliminar si es placeholder
    if (!marca || !modelo || !anio || 
        marca === 'Marca' || modelo === 'Modelo' || 
        String(marca).includes('marca-modelo') ||
        anio === null || anio === 'Año') {
      console.log(`🗑️  Eliminando fila placeholder: ${marca} ${modelo} ${anio}`);
      return false;
    }
    
    return true;
  });
  
  console.log(`📊 Filas originales: ${rows.length}, Filas limpias: ${cleanRows.length}`);
  
  // Crear nueva hoja con datos limpios
  const newSheet = XLSX.utils.aoa_to_sheet(cleanRows);
  wb.Sheets['Características'] = newSheet;
  
  // Guardar archivo limpio
  XLSX.writeFile(wb, EXCEL_PATH);
  console.log('✅ Excel limpiado exitosamente');
}

cleanExcel();
